import ExpoModulesCore
import UIKit
import AVFoundation
import Vision

class MediapipePoseView: ExpoView {
  private let previewLayer = AVCaptureVideoPreviewLayer()
  private let captureSession = AVCaptureSession()
  private let videoDataOutput = AVCaptureVideoDataOutput()
  private let videoQueue = DispatchQueue(label: "com.reboundai.videoQueue")

  // Squat detection state machine
  private var squatState: Int = 0  // 0=standing, 1=descending, 2=atBottom, 3=ascending
  private var squatCount: Int = 0
  private var lastHipY: CGFloat = 0
  private var minHipY: CGFloat = 0

  // Angle thresholds
  private let HIP_MOVEMENT_THRESHOLD: CGFloat = 0.08  // ~8% of frame height movement

  // Events
  let onSquatCount = EventDispatcher()
  let onSquatDepth = EventDispatcher()
  let onFormCorrection = EventDispatcher()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    setupCamera()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    previewLayer.frame = bounds
  }

  private func setupCamera() {
    captureSession.sessionPreset = .high

    guard let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front),
          let input = try? AVCaptureDeviceInput(device: device) else {
      print("Error: Unable to access front camera")
      return
    }

    if captureSession.canAddInput(input) {
      captureSession.addInput(input)
    }

    videoDataOutput.setSampleBufferDelegate(self, queue: videoQueue)
    videoDataOutput.alwaysDiscardsLateVideoFrames = true
    videoDataOutput.videoSettings = [
      kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA
    ]

    if captureSession.canAddOutput(videoDataOutput) {
      captureSession.addOutput(videoDataOutput)
    }

    if let connection = videoDataOutput.connection(with: .video) {
      if #available(iOS 17.0, *) {
        connection.videoRotationAngle = 90
      } else {
        connection.videoOrientation = .portrait
      }
      connection.isVideoMirrored = true
    }

    previewLayer.session = captureSession
    previewLayer.videoGravity = .resizeAspectFill
    layer.addSublayer(previewLayer)

    DispatchQueue.global(qos: .userInitiated).async {
      self.captureSession.startRunning()
    }
  }

  private func processPoseLandmarks(in pixelBuffer: CVPixelBuffer) {
    let request = VNDetectHumanBodyPoseRequest { [weak self] request, error in
      guard let self = self,
            let observations = request.results as? [VNHumanBodyPoseObservation],
            let observation = observations.first else {
        return
      }

      do {
        // Get hip and knee keypoints
        let leftHip = try? observation.recognizedPoint(.leftHip)
        let rightHip = try? observation.recognizedPoint(.rightHip)
        let leftKnee = try? observation.recognizedPoint(.leftKnee)
        let rightKnee = try? observation.recognizedPoint(.rightKnee)

        // Use average hip position for stability
        guard let lHip = leftHip, let rHip = rightHip else { return }
        let avgHipY = (lHip.location.y + rHip.location.y) / 2

        let hipY = avgHipY

        // Calculate depth (how low hips have gone)
        let depth: Int
        if self.lastHipY == 0 {
          self.lastHipY = hipY
          depth = 0
        } else {
          let movement = self.lastHipY - hipY  // Positive = hips went down (smaller Y = lower in image)
          depth = Int(min(100, max(0, (movement / self.HIP_MOVEMENT_THRESHOLD) * 50)))

          self.processSquatState(hipY: hipY, depth: depth)
        }

        DispatchQueue.main.async {
          self.onSquatDepth(["depth": depth, "angle": Float(depth)])
        }

      } catch {
        print("Error processing pose: \(error)")
      }
    }

    let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .up, options: [:])
    do {
      try handler.perform([request])
    } catch {
      print("Vision error: \(error)")
    }
  }

  private func processSquatState(hipY: CGFloat, depth: Int) {
    switch squatState {
    case 0: // Standing
      if depth > 30 {  // Started descending
        squatState = 1
        minHipY = hipY
      }

    case 1: // Descending
      if hipY < minHipY {
        minHipY = hipY
      }
      if depth > 80 {  // Reached bottom
        squatState = 2
      }

    case 2: // At bottom
      if hipY < minHipY {
        minHipY = hipY
      }
      if depth < 70 {  // Started ascending
        squatState = 3
      }

    case 3: // Ascending
      if depth < 20 {  // Back to standing
        squatCount += 1
        onSquatCount(["count": squatCount])
        squatState = 0
        minHipY = hipY
      }

    default:
      squatState = 0
    }

    lastHipY = hipY
  }

  func setCameraPosition(_ position: String) {
    // Future: switch front/back camera
  }
}

extension MediapipePoseView: AVCaptureVideoDataOutputSampleBufferDelegate {
  func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
    processPoseLandmarks(in: pixelBuffer)
  }
}
