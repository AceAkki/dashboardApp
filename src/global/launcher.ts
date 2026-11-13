import { Linking, Platform } from 'react-native';
import { RNLauncherKitHelper } from 'react-native-launcher-kit';
import { appObject } from './AppsConfig';

export async function isInstalled(app: appObject) {
  try {
    if (Platform.OS === 'android' && app.androidPackage) {
      return await RNLauncherKitHelper.checkIfPackageInstalled(app.androidPackage);
    }
    if (app.scheme) {
      return await Linking.canOpenURL(app.scheme);
    }
  } catch (e) {
    console.warn('isInstalled failed', app.id, e);
  }
  return false;
}

export async function launchApp(app:appObject) {
  try {
    if (await isInstalled(app)) {
      if (Platform.OS === 'android' && app.androidPackage) {
        RNLauncherKitHelper.launchApplication(app.androidPackage);
      } else {
        if (app.scheme) await Linking.openURL(app.scheme);
      }
    } else {
      await Linking.openURL(app.fallbackUrl); // store or website
    }
  } catch (e) {
    console.warn('launchApp failed', app.id, e);
  }
}