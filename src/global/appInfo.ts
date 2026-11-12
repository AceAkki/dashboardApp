import Constants from "expo-constants";

export const appCleanName = (Constants.expoConfig?.name ?? "terminaldeck");
export const appName = appCleanName.toUpperCase();
export const APP_TAG = `~/${appCleanName}/`;