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
import React, { useCallback, useRef, useState } from "react";
import type { FlatListProps } from "react-native";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  formatResourceName,
  getIconFile,
  isDisplayDetailedPage,
} from "@/utils/fileUtils";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { useRouter } from "expo-router";
import { useIsMutating } from "@tanstack/react-query";
import Loading from "@/components/LoadingButton";
import type { WalletFile } from "@/types/WalletFile";
import BottomModal from "./BottomModal";
import { ThemedText } from "../ThemedText";

interface FileListProps
  extends Omit<FlatListProps<WalletFile>, "data" | "renderItem"> {
  files: WalletFile[] | undefined;
  isLoading?: boolean;
}

const FileList: React.FC<FileListProps> = ({
  files,
  isLoading = false,
  ...props
}) => {
  const { navigate } = useRouter();
  const isMutatingFiles = useIsMutating({ mutationKey: ["filesMutation"] });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedFile, setSelectedFile] = useState<WalletFile | null>(null);

  const onPressDetailedFile = useCallback((file: WalletFile) => {
    setSelectedFile(file);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleClose = () => {
    bottomSheetModalRef.current?.close();
  };

  const onPressDetail = (file: WalletFile) => {
    if (isDisplayDetailedPage(file)) {
      navigate({
        pathname: `/home/${file.fileName}`,
        params: {
          isRDFResourceStr: String(file.isRDFResource),
          identifier: file.identifier,
        },
      });
    } else {
      setSelectedFile(file);
      bottomSheetModalRef.current?.present();
    }
  };

  const renderItem = ({ item }: { item: WalletFile }) => (
    <TouchableOpacity onPress={() => onPressDetail(item)}>
      <View style={styles.fileContainer}>
        <FontAwesomeIcon
          icon={getIconFile(item.fileName, item.isRDFResource)}
          size={24}
        />

        <ThemedText
          style={styles.itemText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {formatResourceName(item.fileName, item.isRDFResource)}
        </ThemedText>

        <View style={styles.menuIconContainer}>
          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              onPressDetailedFile(item);
            }}
          >
            <FontAwesomeIcon icon={faEllipsis} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <>
      <FlatList
        {...props}
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.identifier}
        contentContainerStyle={styles.container}
      />
      <Loading isLoading={isLoading || !!isMutatingFiles} />

      <BottomSheetModal
        enableDismissOnClose
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={[260, 260, 360, "90%"]}
        backgroundStyle={styles.bottomSheetContainer}
        backdropComponent={({ style }) => (
          <View style={style} onTouchEnd={handleClose} />
        )}
        enablePanDownToClose
      >
        <BottomModal
          onDeleteSuccessfully={() => {
            if (props.onRefresh) props.onRefresh();
          }}
          file={selectedFile}
          onCloseModal={() => bottomSheetModalRef.current?.close()}
          onChangeSnapPoint={(snapHeight: number) => {
            if (snapHeight === 360) bottomSheetModalRef.current?.snapToIndex(2);
            else if (snapHeight <= 260)
              bottomSheetModalRef.current?.snapToIndex(1);
            else bottomSheetModalRef.current?.snapToPosition(snapHeight);
          }}
        />
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomColor: "#E3E8EB",
    borderBottomWidth: 1,
  },
  fileName: {
    marginLeft: 8,
    fontSize: 16,
  },
  itemText: {
    paddingLeft: 18,
    flex: 1,
    fontSize: 16,
    paddingRight: 8,
  },
  menuIconContainer: {
    width: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  flatListLoading: {
    opacity: 0.5, // Reduced opacity when loading
  },
  loadingContainer: {
    position: "static",
    bottom: 36,
    left: 0,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "rgba(0, 0, 0)",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5,
    borderRadius: 16,
    paddingVertical: 14,
  },

  bottomSheetContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 5,
    borderRadius: 26,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default FileList;
