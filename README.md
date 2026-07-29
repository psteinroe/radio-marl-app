# Radio Marl App

The iOS and Android app for [Radio Marl](https://marl-radio.de), built with Expo Router and React Native.

- [Apple App Store](https://apps.apple.com/de/app/radio-marl/id6479979235)
- [Google Play Store](https://play.google.com/store/apps/details?id=com.radio_marl.app)

## Requirements

- Node.js 20.19 or newer
- pnpm 10.12.1 (`corepack enable`)
- EAS CLI 21.4.0 for builds and releases
- Java 17+ and Maestro CLI 2.7.0 for local end-to-end tests
- An Expo development build; Expo Go cannot load the native audio player
- Access to the `radio-marl` Expo/EAS project

> **RNTP license:** `@rntp/player` v5 is free only for its narrowly defined personal or academic use. Confirm eligibility with `team@doublesymmetry.com` / `support@rntp.dev`, or purchase a license, before publishing this build.

## Development

```sh
pnpm install --frozen-lockfile
pnpm run validate
pnpm run build:dev-clients       # needed after native dependency changes
pnpm start
```

Use `pnpm start:ios` or `pnpm start:android` after installing a development client.

## End-to-end tests

Maestro smoke tests cover repeated live-stream start/stop cycles and the song-request navigation flow on Android and iOS. GitHub Actions runs both platforms whenever a pull request is opened, reopened, or updated, and after changes land on `main`. Each job generates and builds a standalone release app, so Metro and a paid EAS plan are not required. JUnit results and Maestro debug output are uploaded as workflow artifacts.

To run a flow locally, build and install the corresponding `e2e-test` profile on an emulator or simulator, install [Maestro CLI](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli), then run:

```sh
pnpm run e2e:android
# or
pnpm run e2e:ios
```

The shared flow is `.maestro/smoke.yml`; each platform script supplies its app identifier. The CI workflow is `.github/workflows/e2e.yml`.

## Audio behavior

The app uses RNTP 5.7 on React Native's New Architecture. Expo SDK 55 is intentional: it supports the New Architecture while retaining the app's iOS 15.1 minimum; SDK 56 and 57 require iOS 16.4. The live stream is marked as live and configured with `liveResumeBehavior: "live-edge"`, so starting playback from the app, lock screen, notification, Android Auto, or CarPlay does not replay a stale buffered position. Network polling is suspended while the app is backgrounded; audio playback is not.

## Deployment

Deploy from a clean, validated `main` branch. GitHub must contain an `EXPO_TOKEN` secret, and EAS must have valid Apple and Google credentials.

### Native release

Use this for dependency, Expo SDK, native configuration, or app-version changes. The current upgrade **requires a native release**; an OTA update is insufficient.

1. Open **Actions → Deploy Native → Run workflow** on GitHub.
2. The workflow builds iOS and Android with EAS and auto-submits both artifacts.
3. Monitor the builds and submissions in the [Expo dashboard](https://expo.dev/accounts/radio-marl/projects/radio-marl-app).
4. Complete App Store review/release steps in App Store Connect. Check Google Play Console for review and production rollout status.

Equivalent local command after `eas login`:

```sh
SHA=$(git rev-parse HEAD) pnpm run deploy:native
```

The command queues builds and returns without waiting. EAS remotely increments the platform build numbers.

### OTA update

Use OTA only for JavaScript or asset changes that remain compatible with the already-published native binary:

1. Open **Actions → Deploy → Run workflow**.
2. The update is published to the `main` channel for iOS and Android.

Equivalent local command:

```sh
pnpm run deploy
```

The runtime version follows the app version. Bump `expo.version` before every native release that must not receive updates built for an older native runtime.
