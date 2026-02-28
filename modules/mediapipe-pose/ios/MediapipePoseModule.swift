import ExpoModulesCore

public class MediapipePoseModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MediapipePose")

    // Body pose view (for squats)
    View(MediapipePoseView.self) {
      Events("onSquatCount")

      Prop("cameraPosition") { (view: MediapipePoseView, prop: String) in
        view.setCameraPosition(prop)
      }
    }

    // Hand pose view (for testing)
    View(HandTrackerView.self) {
      Events("onHandOpenClose", "onLandmarks", "onHandState")
    }
  }
}
