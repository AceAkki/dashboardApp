const { withAndroidManifest } = require('@expo/config-plugins');

const PACKAGES = [
  'com.llamalab.automate',
  'com.brave.browser',
  'org.mozilla.firefox',
  'com.overlook.android.fing',
  'com.flightradar24free',
  'com.glasswire.android',
  'org.torproject.android',
  'org.torproject.torbrowser',
  'com.termux',
  'octohide.vpn',
];

module.exports = function withPackageQueries(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest.queries = manifest.queries ?? [{}];
    const q = manifest.queries[0];
    q.package = q.package ?? [];
    for (const name of PACKAGES) {
      if (!q.package.some((p) => p.$['android:name'] === name)) {
        q.package.push({ $: { 'android:name': name } });
      }
    }
    return cfg;
  });
};