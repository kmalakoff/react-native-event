# Native event smoke app

Install and validate the pinned fixture from this directory:

```sh
npm ci
npm run validate
```

Build and launch a simulator target with the matching platform tooling:

```sh
npm run build:ios
pod install --project-directory=ios
bash ../../test/integration/build-ios.sh <simulator-udid>
```

For Android, use `npm run build:android` followed by `bash ../../test/integration/run-android.sh` from this directory with an API 35 emulator and Maestro installed. The script runs the same fixture command as CI and captures Android diagnostics before emulator teardown.

Maestro uses the device option before the `test` subcommand:

```sh
maestro --device "$ANDROID_SERIAL" test ../../test/integration/maestro/native-event.yaml
```

For iOS, replace `ANDROID_SERIAL` with the simulator UDID in the same command.

The iOS helper builds for the selected simulator, installs with `simctl`, verifies
the application container, and launches it before Maestro runs.
