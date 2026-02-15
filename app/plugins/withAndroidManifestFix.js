// plugins/notification-tools-replace.js
const { withAndroidManifest, AndroidConfig } = require('@expo/config-plugins');

module.exports = function withNotificationToolsReplace(config, props = {}) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    manifest.manifest.$ = manifest.manifest.$ || {};
    if (!manifest.manifest.$['xmlns:tools']) {
      manifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    const application =
      AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
    application['meta-data'] = application['meta-data'] || [];

    const NAME = 'com.google.firebase.messaging.default_notification_color';
    const RESOURCE = props.resource || '@color/notification_icon_color';

    const existing = application['meta-data'].find(
      (m) => m.$['android:name'] === NAME,
    );

    if (existing) {
      existing.$['android:resource'] = RESOURCE;
      existing.$['tools:replace'] = 'android:resource';
    } else {
      application['meta-data'].push({
        $: {
          'android:name': NAME,
          'android:resource': RESOURCE,
          'tools:replace': 'android:resource',
        },
      });
    }

    // Google Play 정책 준수: READ_MEDIA_IMAGES/VIDEO 권한 완전 제거
    // 이 앱은 이미지를 갤러리에서 읽지 않고 저장만 하므로 READ 권한 불필요
    // Android 13+: MediaLibrary.saveToLibraryAsync()는 READ 권한 없이도 작동
    // Android 12 이하: WRITE_EXTERNAL_STORAGE 권한으로 충분
    manifest.manifest['uses-permission'] =
      manifest.manifest['uses-permission'] || [];

    const permissionsToRemove = [
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.READ_MEDIA_VIDEO',
      'android.permission.READ_MEDIA_AUDIO',
    ];

    manifest.manifest['uses-permission'] = manifest.manifest[
      'uses-permission'
    ].filter((permission) => {
      return (
        !permission.$ ||
        !permissionsToRemove.includes(permission.$['android:name'])
      );
    });

    return config;
  });
};
