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
import React, { useRef } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { PermissionStatus } from "expo-image-picker";
import { useMutation } from "@tanstack/react-query";
import { postFile } from "@/api/files";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile";
import { faCamera } from "@fortawesome/free-solid-svg-icons/faCamera";
import { faQrcode } from "@fortawesome/free-solid-svg-icons/faQrcode";
import { useError } from "@/hooks/useError";
import * as Linking from "expo-linking";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "./ThemedText";

const { width } = Dimensions.get("window");
type PopupMenuProps = {
  visible: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  position: { x: number | undefined; y: number | undefined };
  positionType: "topMiddle" | "bottomLeft" | "bottomMiddle";
};

const menuItems = [
  { icon: faFile, text: "File" },
  { icon: faImage, text: "Photo" },
  { icon: faCamera, text: "Camera" },
  { icon: faQrcode, text: "Scan" },
];

const PopupMenu: React.FC<PopupMenuProps> = ({
  visible,
  onClose,
  position,
  positionType,
  onUploadSuccess,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const menuRef = useRef(null);
  const { showErrorMsg } = useError();

  const mutation = useMutation({
    mutationFn: postFile,
    onSuccess: onUploadSuccess,
    onError: (error) => {
      console.debug("A non-HTTP error occurred.", error);
      showErrorMsg("Unable to save the file into your Wallet.");
    },
    mutationKey: ["filesMutation"],
  });
  if (!visible) return null;
  const { x, y } = position;
  if (!x || !y) return null;
  const screenWidth = Dimensions.get("window").width;
  let menuStyle = {};
  switch (positionType) {
    case "topMiddle":
      menuStyle = { bottom: insets.bottom + 56, left: screenWidth / 2 - 79 };
      break;
    case "bottomLeft":
      menuStyle = { top: y + 40, left: x - 140 };
      break;
    case "bottomMiddle":
      menuStyle = { top: y - 30, left: screenWidth / 2 - 79 };
      break;
    default:
      break;
  }

  const handleDeniedPermissions = (note: string) => {
    Alert.alert(
      "Permission Denied",
      `${note}. Please enable it in your device settings.`,
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

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== PermissionStatus.GRANTED) {
      onClose();
      handleDeniedPermissions("Camera access is required to take photos");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (result.canceled || result.assets.length === 0) {
      onClose();
      return;
    }
    const selectedPhoto = result.assets[0];
    mutation.mutate({
      uri: selectedPhoto.uri,
      name:
        selectedPhoto.fileName ||
        selectedPhoto.uri.substring(selectedPhoto.uri.lastIndexOf("/") + 1),
    });
    onClose();
  };

  const handleMenuItemPress = async (item: string) => {
    if (item === "File") {
      const result = await DocumentPicker.getDocumentAsync();
      if (!result.canceled && result.assets) {
        const selectedFile = result.assets[0];
        mutation.mutate(selectedFile);
      }
      onClose();
    } else if (item === "Photo") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== PermissionStatus.GRANTED) {
        onClose();
        handleDeniedPermissions("Image Library access is required");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled && result.assets) {
        const selectedFile = result.assets[0];
        mutation.mutate({
          uri: selectedFile.uri,
          name: selectedFile.fileName || "",
        });
      }
      onClose();
    } else if (item === "Camera") {
      await takePicture();
    } else if (item === "Scan") {
      router.navigate("/scan-qr");
      onClose();
    }
  };

  return (
    <TouchableOpacity
      style={styles.overlay}
      onPress={onClose}
      activeOpacity={1}
    >
      <TouchableOpacity
        ref={menuRef}
        style={[styles.menu, menuStyle]}
        activeOpacity={1}
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item.text)}
          >
            <FontAwesomeIcon icon={item.icon} size={24} />
            <ThemedText style={styles.menuText}>{item.text}</ThemedText>
          </TouchableOpacity>
        ))}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    width: 158,
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 9 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  icon: {
    width: 26,
  },
  menuText: {
    marginLeft: 16,
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "column",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  cancelText: {
    fontSize: 16,
    color: "#FFF",
    textDecorationLine: "underline",
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

export default PopupMenu;
