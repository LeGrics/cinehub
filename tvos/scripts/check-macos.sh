#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
swift test
xcodebuild -project CineHub.xcodeproj -scheme CineHub -sdk appletvsimulator \
  -destination 'generic/platform=tvOS Simulator' \
  -derivedDataPath .build-xcode CODE_SIGNING_ALLOWED=NO build
