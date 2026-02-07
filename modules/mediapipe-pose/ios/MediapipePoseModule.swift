import ExpoModulesCore

public class MediapipePoseModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MediapipePose")

    View(MediapipePoseView.self) {
      Events("onSquatCount")

      Prop("cameraPosition") { (view: MediapipePoseView, prop: String) in
        view.setCameraPosition(prop)
      }
    }
  }
}
