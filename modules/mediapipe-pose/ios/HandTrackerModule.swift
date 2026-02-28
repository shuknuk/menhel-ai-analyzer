import ExpoModulesCore

public class HandTrackerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("HandTrackerView")

    View(HandTrackerView.self) {
      Events("onHandOpenClose", "onLandmarks", "onHandState")
    }
  }
}