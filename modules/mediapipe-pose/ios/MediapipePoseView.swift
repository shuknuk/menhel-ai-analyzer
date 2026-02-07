import ExpoModulesCore
import UIKit
import AVFoundation
import MediaPipeTasksVision

class MediapipePoseView: ExpoView {
  private let previewLayer = AVCaptureVideoPreviewLayer()
  private let captureSession = AVCaptureSession()
  private let videoDataOutput = AVCaptureVideoDataOutput()
  private let videoQueue = DispatchQueue(label: "com.menhel.videoQueue")
  private var poseLandmarker: PoseLandmarker?
  
  // Squat logic
  private var isSquatting = false
  private var squatCount = 0
  private var lastHipY: Float = 0.0

  // Events
  let onSquatCount = EventDispatcher()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    setupCamera()
    setupMediaPipe()
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
    
    if captureSession.canAddOutput(videoDataOutput) {
      captureSession.addOutput(videoDataOutput)
    }

    previewLayer.session = captureSession
    previewLayer.videoGravity = .resizeAspectFill
    layer.addSublayer(previewLayer)

    DispatchQueue.global(qos: .userInitiated).async {
      self.captureSession.startRunning()
    }
    
    // Start simulation timer
    Timer.scheduledTimer(withTimeInterval: 3.0, repeats: true) { [weak self] _ in
      guard let self = self else { return }
      self.squatCount += 1
      self.onSquatCount(["count": self.squatCount])
    }
  }

  private func setupMediaPipe() {
    // Ideally, we load the model from bundle.
    // let modelPath = Bundle.main.path(forResource: "pose_landmarker", ofType: "task")
    // ... setup PoseLandmarker with options
  }
  func setCameraPosition(_ position: String) {
    // Implement camera switching logic in the future
  }
}

extension MediapipePoseView: AVCaptureVideoDataOutputSampleBufferDelegate {
  func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    // Suppress unused warning by binding to underscore if not used, or just keeping it for now but suppressing warning
    guard let _ = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
    
    // Convert pixelBuffer to MPImage
    // let image = MPImage(pixelBuffer: pixelBuffer)
    
    // Detect pose
    // try? poseLandmarker?.detect(image: image)
    
    // For now, simulate squat counting every 5 seconds for testing UI
    // In real implementation, this logic is triggered by pose landmarks
    // self.onSquatCount(["count": self.squatCount])
  }
}
