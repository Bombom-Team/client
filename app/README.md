# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Sentry

앱은 웹과 별도의 Sentry 프로젝트를 사용합니다. 앱 시작 시에는 아래 공개 환경 변수가
필요합니다. DSN은 클라이언트에 포함되어도 되는 식별자입니다.

```bash
EXPO_PUBLIC_SENTRY_DSN=https://...@o....ingest.sentry.io/...
EXPO_PUBLIC_SENTRY_ENVIRONMENT=production
```

EAS 빌드에서 릴리스와 소스맵을 업로드하려면 아래 비공개 환경 변수를 설정합니다.
`SENTRY_AUTH_TOKEN`은 EAS의 Sensitive 변수로만 관리하고, 앱 공개 환경 변수로 넣지 않습니다.

```bash
SENTRY_RN_ORG=your-sentry-org
SENTRY_RN_PROJECT=your-rn-project
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

`SENTRY_RN_ORG`와 `SENTRY_RN_PROJECT`를 모두 설정한 경우에만 Expo Sentry 플러그인이
활성화됩니다. 설정이 빠진 빌드에서 source map upload를 시도하지 않기 위한 조건이며,
값이 올바른 앱 프로젝트를 가리키는지는 EAS 환경변수 설정에서 관리합니다. 개발 모드와 웹
플랫폼에서는 앱 Sentry 초기화를 건너뜁니다.

org/project는 사용하지만 인증 토큰 없이 로컬 빌드해야 한다면 Sentry SDK가 지원하는
환경변수로 자동 업로드를 명시적으로 끕니다. preview/production 빌드에서는 이 값을
설정하지 않아야 source map과 debug symbol이 업로드됩니다.

```bash
SENTRY_DISABLE_AUTO_UPLOAD=true pnpm build:android
```


Android는 Sentry Android Gradle plugin으로 release의 R8/ProGuard mapping과 native
symbol 업로드를 연결합니다. native 소스 코드 원문 업로드는 비활성화합니다. JS source map
업로드는 기존 RN 스크립트로 유지합니다.

이 설정을 추가한 뒤 Android production 빌드를 다시 실행하고, Sentry mapping·native
symbol 업로드 task의 실행과 성공 로그를 확인해야 합니다. 빌드 성공만으로 모든 native
라이브러리의 심볼 복원이 보장되지는 않으며, 해당 라이브러리의 debug symbol이 필요합니다.
