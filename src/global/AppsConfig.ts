// Launcher app config
// scheme: URL scheme used with Linking.canOpenURL / openURL (null = none known)
// androidPackage: used to check/launch on Android via a native module
// verified: false = guessed from memory, test on a device before shipping
export type appObject =  {
    id: string,
    name: string,
    scheme: string | null,
    androidPackage: string | null,
    fallbackUrl: string,
    platforms: string[],
    verified: boolean,
  }

export const APPS = [
  {
    id: 'automate',
    name: 'Automate',
    scheme: null,
    androidPackage: 'com.llamalab.automate',
    fallbackUrl: 'https://llamalab.com/automate/',
    platforms: ['android'],
    verified: true,
  },
  {
    id: 'brave',
    name: 'Brave',
    scheme: 'brave://',
    androidPackage: 'com.brave.browser',
    fallbackUrl: 'https://brave.com/download/',
    platforms: ['android', 'ios'],
    verified: true,
  },
  {
    id: 'firefox',
    name: 'Firefox',
    scheme: 'firefox://',
    androidPackage: 'org.mozilla.firefox',
    fallbackUrl: 'https://www.mozilla.org/firefox/new/',
    platforms: ['android', 'ios'],
    verified: true,
  },
  {
    id: 'fing',
    name: 'Fing',
    scheme: 'fing://',
    androidPackage: 'com.overlook.android.fing',
    fallbackUrl: 'https://www.fing.com/',
    platforms: ['android', 'ios'],
    verified: false,
  },
  {
    id: 'flightradar24',
    name: 'Flightradar24',
    scheme: 'flightradar24://',
    androidPackage: 'com.flightradar24free',
    fallbackUrl: 'https://www.flightradar24.com/',
    platforms: ['android', 'ios'],
    verified: false,
  },
  {
    id: 'glasswire',
    name: 'GlassWire',
    scheme: null,
    androidPackage: 'com.glasswire.android',
    fallbackUrl: 'https://www.glasswire.com/',
    platforms: ['android'],
    verified: false,
  },
  {
    id: 'orbot',
    name: 'Orbot',
    scheme: null,
    androidPackage: 'org.torproject.android',
    fallbackUrl: 'https://guardianproject.info/apps/org.torproject.android/',
    platforms: ['android', 'ios'],
    verified: false,
  },
  {
    id: 'tor-browser',
    name: 'Tor Browser',
    scheme: null,
    androidPackage: 'org.torproject.torbrowser',
    fallbackUrl: 'https://www.torproject.org/download/',
    platforms: ['android'],
    verified: true,
  },
  {
    id: 'termux',
    name: 'Termux',
    scheme: null,
    androidPackage: 'com.termux',
    fallbackUrl: 'https://f-droid.org/packages/com.termux/',
    platforms: ['android'],
    verified: true,
  },
  {
    id: 'octohide',
    name: 'Octohide VPN',
    scheme: null,
    androidPackage: 'octohide.vpn',
    fallbackUrl: 'https://octohide.com/',
    platforms: ['android', 'ios'],
    verified: false,
  },
];

export const appsIDs = APPS.map(app => app.id);