/** @type {Detox.DetoxConfig} */
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.ts'
    },
    jest: {
      setupTimeout: 120000
    }
  },
  apps: {
    'ios.release': {
      type: 'ios.app',
      binaryPath: process.env.IOS_BINARY_PATH,
      build: 'xcodebuild -workspace ios/inruptwalletfrontend.xcworkspace -scheme inruptwalletfrontend -configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      testBinaryPath: 'android/app/build/outputs/apk/androidTest/release/app-release-androidTest.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release  && cd ..'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      testBinaryPath: 'android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug  && cd ..'
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: process.env.TEST_IOS_SIM
      }
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: process.env.TEST_ANDROID_EMU
      },
    }
  },
  configurations: {
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release'
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release'
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release'
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug'
    }
  },
  custom: {
    defaultTestTimeout: 15000
  },
  artifacts: {
    rootDir: "./screenshots/",
    plugins: {
      log: {"enabled": true},
      uiHierarchy: {"enabled": true},
      screenshot: {
        keepOnlyFailedTestsArtifacts: false,
        takeWhen: {
          "testStart": true,
          "testDone": true
        }
      },
      video: {
        enabled: true
      }
    }
  }
};
