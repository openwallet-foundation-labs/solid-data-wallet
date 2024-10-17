//
// Copyright Inrupt Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useError } from "@/hooks/useError";
import type { BarcodeScanningResult } from "expo-camera";
import { CameraView, Camera } from "expo-camera";
import { isAccessPromptQR, isDownloadQR } from "@/types/accessPrompt";
import * as Linking from "expo-linking";
import { PermissionStatus } from "expo-image-picker";
import { ThemedText } from "@/components/ThemedText";

const { width } = Dimensions.get("window");

class UnrecognisedQrCodeError extends Error {
  constructor() {
    super("QR code not a recognized type");
  }
}

export default function ScanQr() {
  const { goBack } = useNavigation();
  const { showErrorMsg } = useError();
  const { replace, navigate } = useRouter();
  const [showScanned, setShowScanned] = useState(false);
  const handleDeniedPermissions = () => {
    Alert.alert(
      "Permission Denied",
      "Camera access is required. Please enable it in your device settings.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => Linking.openSettings(), // This will open the app settings page
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== PermissionStatus.GRANTED) {
        handleDeniedPermissions();
        return;
      }
      setShowScanned(true);
    };
    getCameraPermissions().catch(() => {
      console.log("Don't have camera permission");
    });
  }, []);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    setShowScanned(false);
    try {
      const resourceInfo = JSON.parse(data);
      if (isAccessPromptQR(resourceInfo)) {
        replace({
          pathname: "/access-prompt",
          params: {
            webId: resourceInfo.webId,
            client: resourceInfo.client,
            type: resourceInfo.type,
          },
        });
      } else if (isDownloadQR(resourceInfo)) {
        navigate({
          pathname: "/home/download",
          params: {
            uri: resourceInfo.uri,
            contentType: resourceInfo.contentType,
          },
        });
      } else {
        throw new UnrecognisedQrCodeError();
      }
    } catch (err) {
      showErrorMsg("QR code not a valid format");
      if (err instanceof UnrecognisedQrCodeError) {
        console.warn(err);
      } else {
        console.warn("QR code not a valid format");
      }
      goBack();
    }
  };
  return (
    <View style={styles.modalContainer}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.headerText}>Scan</ThemedText>
        </View>
        <TouchableOpacity
          onPress={() => {
            goBack();
          }}
          style={styles.cancelContainer}
        >
          <ThemedText style={styles.cancelText}>Cancel</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.cameraContainer}>
        {showScanned && (
          <CameraView
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            style={styles.camera}
          />
        )}
      </View>
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>Scan a QR code</ThemedText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "column",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 24,
    alignItems: "center",
  },

  headerText: {
    fontSize: 18,
    color: "#FFF",
  },
  cancelContainer: {
    position: "absolute",
    right: 24,
    top: 26,
    alignItems: "flex-end",
  },
  cancelText: {
    fontSize: 16,
    color: "#FFF",
    alignItems: "center",
  },
  cameraContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: width,
    width: "100%",
    marginTop: 40,
  },
  camera: {
    width,
    height: width,
  },
  footer: {
    flex: 1,
    padding: 16,

    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#FFF",
  },
});
