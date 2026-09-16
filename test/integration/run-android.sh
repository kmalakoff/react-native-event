#!/usr/bin/env bash

set -eu

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/../.." && pwd)"
FIXTURE_ROOT="$REPO_ROOT/examples/native-test-app"
DIAGNOSTICS_ROOT="$REPO_ROOT/.tmp"

collect_diagnostics() {
  status=$?
  mkdir -p "$DIAGNOSTICS_ROOT"
  adb devices > "$DIAGNOSTICS_ROOT/android-devices.txt" || true
  adb logcat -d > "$DIAGNOSTICS_ROOT/android-logcat.txt" || true
  exit "$status"
}

trap collect_diagnostics EXIT

cd "$FIXTURE_ROOT"
export PATH="$HOME/.maestro/bin:$PATH"
export MAESTRO_DRIVER_STARTUP_TIMEOUT="${MAESTRO_DRIVER_STARTUP_TIMEOUT:-600000}"

adb wait-for-device
adb shell getprop sys.boot_completed | grep -m 1 '1'
npm run android -- --no-packager

ANDROID_DEVICE="${ANDROID_SERIAL:-$(adb devices | awk 'NR > 1 && $2 == "device" { print $1; exit }')}"
test -n "$ANDROID_DEVICE"
maestro --device "$ANDROID_DEVICE" test "$REPO_ROOT/test/integration/maestro/native-event.yaml"
