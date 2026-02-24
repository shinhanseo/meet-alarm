// app.config.js
export default {
  expo: {
    name: "지금이니",
    slug: "meet-alarm",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/bears/right_now_icon.png",
    scheme: "meetalarm",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      bundleIdentifier: "com.imkara1.meetalarm",
      bundleName: "지금이니",
      supportsTablet: false,
      buildNumber: "3",
      icon: "./assets/bears/right_now_icon.png",
      infoPlist: {
        NSCameraUsageDescription: "출발 인증 사진을 위해 카메라 접근이 필요해요.",
        NSLocationWhenInUseUsageDescription: "출발지를 현재위치로 설정하기 위해 위치 접근이 필요해요.",
        NSUserNotificationUsageDescription: "약속 알림을 보내기 위해 알림 권한이 필요해요.",
      },
    },

    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: ["android.permission.CAMERA", "android.permission.RECORD_AUDIO"],
      package: "com.imkara1.meetalarm",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/bears/right_now_icon.png",
          color: "#E6F4FE",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "출발 인증 사진을 위해 카메라 접근이 필요해요.",
        },
      ],
      "@react-native-community/datetimepicker",
      "expo-secure-store",
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      API_BASE_URL: "https://api.meetalarm.kr",
      router: {},
      eas: {
        projectId: "82825f0b-c0e8-4629-8b08-257b68a76ff0",
      },
    },
  },
};