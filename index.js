// App entry point.
// package.json "main" must point here (instead of "expo-router/entry") so that the widget
// task handler is registered even when Android starts the app headless (app closed) just to draw
// or handle a tap on a home screen widget.

import "expo-router/entry";

import { Platform } from "react-native";
import { registerWidgetTaskHandler } from "react-native-android-widget";

import { widgetTaskHandler } from "./src/features/widgets/widgetTaskHandler";

if (Platform.OS === "android") {
  registerWidgetTaskHandler(widgetTaskHandler);
}
