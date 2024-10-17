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
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFile, downloadFile } from "@/api/files";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import QRCode from "react-native-qrcode-svg";
import { formatResourceName } from "@/utils/fileUtils";
import type { UserInfo } from "@/constants/user";
import type { WalletFile } from "@/types/WalletFile";
import { ThemedText } from "../ThemedText";
import ConfirmModal from "../common/ConfirmModal";

interface BottomModalProps {
  file: WalletFile | null;
  onCloseModal: () => void;
  onDeleteSuccessfully?: () => void;
  onChangeSnapPoint: (index: number) => void;
}

const BottomModal: React.FC<BottomModalProps> = ({
  file,
  onCloseModal,
  onDeleteSuccessfully,
  onChangeSnapPoint,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fileDownload, setFileDownload] = useState<string | null>(null);
  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo"],
    staleTime: Infinity,
  });
  const [isShowQRCode, setShowQRCode] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      onDeleteSuccessfully?.();
    },
    mutationKey: ["filesMutation"],
  });
  const queryClient = useQueryClient();

  const onFileShare = useCallback(
    async (fileName: string) => {
      const data = await queryClient.fetchQuery<Blob>({
        queryKey: ["downloadFile", fileName],
        queryFn: () => downloadFile(fileName),
      });

      setFileDownload(null);

      if (!data) return;
      const fr = new FileReader();
      fr.onload = async () => {
        const fileUri = new URL(fileName, FileSystem.documentDirectory!);
        if (typeof fr.result !== "string") {
          throw new Error("An error occurred while reading the file.");
        }
        await FileSystem.writeAsStringAsync(
          fileUri.toString(),
          fr.result.split(",")[1],
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );
        await Sharing.shareAsync(fileUri.toString());
      };
      fr.readAsDataURL(data);
    },
    [queryClient]
  );

  useEffect(() => {
    if (fileDownload) {
      onFileShare(fileDownload).catch(() =>
        console.log("Error while sharing data")
      );
    }
  }, [fileDownload, onFileShare]);

  const onDeleteFile = async (fileName: string) => {
    deleteMutation
      .mutateAsync(fileName)
      // eslint-disable-next-line no-console
      .catch(() => console.error("Error while deleting data"));
    onCloseModal();
  };

  const onShareViaQR = () => {
    setShowQRCode(true);
    onChangeSnapPoint(360);
  };

  return (
    <>
      <BottomSheetView style={styles.bottomSheetContent}>
        <View style={styles.fileDetailedTitle}>
          {isShowQRCode && (
            <TouchableOpacity
              onPress={() => {
                setShowQRCode(false);
                onChangeSnapPoint(260);
              }}
            >
              <FontAwesome6 size={20} name="chevron-left" />
            </TouchableOpacity>
          )}

          <ThemedText
            ellipsizeMode={"tail"}
            numberOfLines={1}
            style={{ fontSize: 18, paddingLeft: isShowQRCode ? 16 : 0 }}
          >
            {formatResourceName(
              file?.fileName || "",
              file?.isRDFResource || false
            )}
          </ThemedText>
        </View>
        {isShowQRCode ? (
          <View style={styles.qrContainer}>
            <QRCode
              size={203}
              value={JSON.stringify({
                webId: userInfo?.webId,
                resource: file?.identifier,
              })}
            />
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.fileDetailMenuContainer}
              onPress={() => file && onShareViaQR()}
            >
              <FontAwesome6 size={24} name="share" />
              <ThemedText style={{ paddingLeft: 24, fontSize: 16 }}>
                Share via QR Code
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fileDetailMenuContainer}
              onPress={() => file && setFileDownload(file?.fileName)}
            >
              <FontAwesome6 size={24} name="download" />
              <ThemedText style={{ paddingLeft: 16, fontSize: 16 }}>
                Download a copy
              </ThemedText>
              {Boolean(fileDownload) && (
                <ActivityIndicator
                  style={{ paddingLeft: 24 }}
                  size={24}
                  color="#000"
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fileDetailMenuContainer}
              onPress={() => file && setModalVisible(true)}
            >
              <FontAwesome6 size={24} name="trash" />
              <ThemedText style={{ paddingLeft: 24, fontSize: 16 }}>
                Delete
              </ThemedText>
            </TouchableOpacity>
          </>
        )}
      </BottomSheetView>
      <ConfirmModal
        visible={modalVisible}
        title={"Delete from wallet?"}
        content={`${file?.fileName} will be deleted from your wallet and any access to it will be revoked.`}
        onConfirm={() => onDeleteFile(file?.fileName as string)}
        confirmLabel={"Delete"}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 5,
    borderRadius: 26,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 24,
  },

  fileDetailMenuContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 24,
  },
  fileDetailedTitle: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.secondary,
  },
  qrContainer: {
    paddingTop: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BottomModal;
