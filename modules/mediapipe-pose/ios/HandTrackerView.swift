import ExpoModulesCore
import UIKit
import AVFoundation
import Vision

class HandTrackerView: ExpoView {
  private let previewLayer = AVCaptureVideoPreviewLayer()
  private let captureSession = AVCaptureSession()
  private let videoDataOutput = AVCaptureVideoDataOutput()
  private let videoQueue = DispatchQueue(label: "com.reboundai.handTrackingQueue")

  // Hand gesture state
  private var handOpenCount: Int = 0
  private var lastHandState: Bool = false  // false = closed, true = open
  private var landmarks: [[String: Float]] = []

  // Events
  let onHandOpenClose = EventDispatcher()
  let onLandmarks = EventDispatcher()
  let onHandState = EventDispatcher()

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

  private func processHandLandmarks(in pixelBuffer: CVPixelBuffer) {
    let request = VNDetectHumanHandPoseRequest { [weak self] request, error in
      guard let self = self,
            let observations = request.results as? [VNHumanHandPoseObservation],
            let observation = observations.first else {
        // No hand detected
        DispatchQueue.main.async {
          self?.onLandmarks(["landmarks": []])
        }
        return
      }

      do {
        // Get all hand landmarks
        var allLandmarks: [[String: Float]] = []

        // Wrist
        let wrist = try observation.recognizedPoint(.wrist)
        allLandmarks.append(["x": Float(wrist.location.x), "y": Float(wrist.location.y), "confidence": Float(wrist.confidence)])

        // Thumb
        let thumbCMC = try observation.recognizedPoint(.thumbCMC)
        let thumbMP = try observation.recognizedPoint(.thumbMP)
        let thumbIP = try observation.recognizedPoint(.thumbIP)
        let thumbTip = try observation.recognizedPoint(.thumbTip)

        allLandmarks.append(["x": Float(thumbCMC.location.x), "y": Float(thumbCMC.location.y), "confidence": Float(thumbCMC.confidence)])
        allLandmarks.append(["x": Float(thumbMP.location.x), "y": Float(thumbMP.location.y), "confidence": Float(thumbMP.confidence)])
        allLandmarks.append(["x": Float(thumbIP.location.x), "y": Float(thumbIP.location.y), "confidence": Float(thumbIP.confidence)])
        allLandmarks.append(["x": Float(thumbTip.location.x), "y": Float(thumbTip.location.y), "confidence": Float(thumbTip.confidence)])

        // Index finger
        let indexMCP = try observation.recognizedPoint(.indexMCP)
        let indexPIP = try observation.recognizedPoint(.indexPIP)
        let indexDIP = try observation.recognizedPoint(.indexDIP)
        let indexTip = try observation.recognizedPoint(.indexTip)

        allLandmarks.append(["x": Float(indexMCP.location.x), "y": Float(indexMCP.location.y), "confidence": Float(indexMCP.confidence)])
        allLandmarks.append(["x": Float(indexPIP.location.x), "y": Float(indexPIP.location.y), "confidence": Float(indexPIP.confidence)])
        allLandmarks.append(["x": Float(indexDIP.location.x), "y": Float(indexDIP.location.y), "confidence": Float(indexDIP.confidence)])
        allLandmarks.append(["x": Float(indexTip.location.x), "y": Float(indexTip.location.y), "confidence": Float(indexTip.confidence)])

        // Middle finger
        let middleMCP = try observation.recognizedPoint(.middleMCP)
        let middlePIP = try observation.recognizedPoint(.middlePIP)
        let middleDIP = try observation.recognizedPoint(.middleDIP)
        let middleTip = try observation.recognizedPoint(.middleTip)

        allLandmarks.append(["x": Float(middleMCP.location.x), "y": Float(middleMCP.location.y), "confidence": Float(middleMCP.confidence)])
        allLandmarks.append(["x": Float(middlePIP.location.x), "y": Float(middlePIP.location.y), "confidence": Float(middlePIP.confidence)])
        allLandmarks.append(["x": Float(middleDIP.location.x), "y": Float(middleDIP.location.y), "confidence": Float(middleDIP.confidence)])
        allLandmarks.append(["x": Float(middleTip.location.x), "y": Float(middleTip.location.y), "confidence": Float(middleTip.confidence)])

        // Ring finger
        let ringMCP = try observation.recognizedPoint(.ringMCP)
        let ringPIP = try observation.recognizedPoint(.ringPIP)
        let ringDIP = try observation.recognizedPoint(.ringDIP)
        let ringTip = try observation.recognizedPoint(.ringTip)

        allLandmarks.append(["x": Float(ringMCP.location.x), "y": Float(ringMCP.location.y), "confidence": Float(ringMCP.confidence)])
        allLandmarks.append(["x": Float(ringPIP.location.x), "y": Float(ringPIP.location.y), "confidence": Float(ringPIP.confidence)])
        allLandmarks.append(["x": Float(ringDIP.location.x), "y": Float(ringDIP.location.y), "confidence": Float(ringDIP.confidence)])
        allLandmarks.append(["x": Float(ringTip.location.x), "y": Float(ringTip.location.y), "confidence": Float(ringTip.confidence)])

        // Little finger
        let littleMCP = try observation.recognizedPoint(.littleMCP)
        let littlePIP = try observation.recognizedPoint(.littlePIP)
        let littleDIP = try observation.recognizedPoint(.littleDIP)
        let littleTip = try observation.recognizedPoint(.littleTip)

        allLandmarks.append(["x": Float(littleMCP.location.x), "y": Float(littleMCP.location.y), "confidence": Float(littleMCP.confidence)])
        allLandmarks.append(["x": Float(littlePIP.location.x), "y": Float(littlePIP.location.y), "confidence": Float(littlePIP.confidence)])
        allLandmarks.append(["x": Float(littleDIP.location.x), "y": Float(littleDIP.location.y), "confidence": Float(littleDIP.confidence)])
        allLandmarks.append(["x": Float(littleTip.location.x), "y": Float(littleTip.location.y), "confidence": Float(littleTip.confidence)])

        // Determine if hand is open or closed
        // Calculate average distance from fingertips to wrist
        let wristPoint = wrist.location

        let fingerTips = [indexTip, middleTip, ringTip, littleTip]
        var totalTipDistance: CGFloat = 0

        for tip in fingerTips {
          let dx = tip.location.x - wristPoint.x
          let dy = tip.location.y - wristPoint.y
          totalTipDistance += sqrt(dx * dx + dy * dy)
        }
        let avgTipDistance = totalTipDistance / CGFloat(fingerTips.count)

        // Threshold for open vs closed hand
        // When hand is open, fingertips are ~0.3-0.5 units from wrist
        // When hand is closed (fist), fingertips are ~0.1-0.2 units from wrist
        let isOpen = avgTipDistance > 0.22

        // Detect state change: closed -> open
        if isOpen && !self.lastHandState {
          self.handOpenCount += 1
          DispatchQueue.main.async {
            self.onHandOpenClose(["count": self.handOpenCount])
          }
        }

        self.lastHandState = isOpen
        self.landmarks = allLandmarks

        DispatchQueue.main.async {
          self.onLandmarks(["landmarks": allLandmarks])
          self.onHandState(["isOpen": isOpen, "avgTipDistance": Float(avgTipDistance)])
        }

      } catch {
        print("Error processing hand pose: \(error)")
      }
    }

    // Detect up to 2 hands
    request.maximumHandCount = 1

    let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .up, options: [:])
    do {
      try handler.perform([request])
    } catch {
      print("Vision error: \(error)")
    }
  }
}

extension HandTrackerView: AVCaptureVideoDataOutputSampleBufferDelegate {
  func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
    processHandLandmarks(in: pixelBuffer)
  }
}