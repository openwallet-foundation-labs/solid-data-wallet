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
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useIsMutating, useQuery } from "@tanstack/react-query";
import { getFile } from "@/api/files";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { isImageFile } from "@/utils/fileUtils";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import VcCard from "@/components/files/VcCard";
import BottomModal from "@/components/files/BottomModal";
import type { WalletFile } from "@/types/WalletFile";
import Loading from "@/components/LoadingButton";
import { ThemedText } from "@/components/ThemedText";

interface FileDetailProps {
  file: WalletFile;
  onClose: () => void;
  onOpenMenu: (file: WalletFile) => void;
}
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const Page: React.FC<FileDetailProps> = () => {
  const isMutatingFiles = useIsMutating({ mutationKey: ["filesMutation"] });

  const { fileName, isRDFResourceStr, identifier } = useLocalSearchParams();
  const isRDFResource: boolean = isRDFResourceStr === "true";
  const [imageUri, setImageUri] = useState<string | null>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { setOptions, goBack } = useNavigation("/(tabs)");
  const currentNavigation = useNavigation();
  // data can be a json file from server so need to use any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = useQuery<Blob | any>({
    queryKey: ["file", fileName],
    queryFn: () => getFile(fileName as string),
  });

  useEffect(() => {
    setOptions({ headerShown: false });
    return () => {
      setOptions({ headerShown: true });
    };
  }, [setOptions]);
  useLayoutEffect(() => {
    currentNavigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => bottomSheetModalRef.current?.present()}
        >
          <FontAwesomeIcon icon={faEllipsis} size={24} />
        </TouchableOpacity>
      ),
      headerBackVisible: false,
      headerTitleAlign: "center",
      headerTitleStyle: {
        alignItems: "center",
        justifyContent: "center",
      },
      headerTitle: () => (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "85%",
            paddingRight: 16,
          }}
        >
          <ThemedText numberOfLines={1} ellipsizeMode={"tail"}>
            {data?.name || fileName}
          </ThemedText>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => currentNavigation.goBack()}
          style={{ paddingLeft: 8 }}
        >
          <FontAwesome6 size={20} name="xmark" />
        </TouchableOpacity>
      ),
    });
  }, [currentNavigation, data?.name, fileName]);
  useEffect(() => {
    const fetchImageAsBlob = async () => {
      try {
        const base64Data = await blobToBase64(data);
        setImageUri(`data:image/png;base64,${base64Data}`);
      } catch (error) {
        /* empty */
      }
    };

    if (data && isImageFile(fileName as string)) {
      fetchImageAsBlob().catch(() => {
        /* empty */
      });
    }
  }, [data, fileName]);

  return (
    <View style={styles.modalContainer}>
      {isImageFile(fileName as string) && imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.modalImage}
          resizeMode="contain"
        />
      )}
      {isRDFResource && data && <VcCard data={data} />}
      <Loading isLoading={!!isMutatingFiles} />
      <BottomSheetModal
        enableDismissOnClose
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={[260, 260, 360, "90%"]}
        backgroundStyle={styles.bottomSheetContainer}
        backdropComponent={({ style }) => (
          <View
            style={[style, styles.backdrop]}
            onTouchEnd={() => bottomSheetModalRef.current?.close()}
          />
        )}
        enablePanDownToClose
      >
        <BottomModal
          file={{
            fileName: fileName as string,
            identifier: identifier as string,
            isRDFResource,
          }}
          onCloseModal={() => bottomSheetModalRef.current?.close()}
          onDeleteSuccessfully={goBack}
          onChangeSnapPoint={(snapHeight: number) => {
            if (snapHeight === 360) bottomSheetModalRef.current?.snapToIndex(2);
            else if (snapHeight <= 260)
              bottomSheetModalRef.current?.snapToIndex(1);
            else bottomSheetModalRef.current?.snapToPosition(snapHeight);
          }}
        />
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 32,
    backgroundColor: "#FFF",
    justifyContent: "center",
  },
  fileName: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },

  modalContent: {
    flex: 1,
  },

  modalImage: {
    width: "100%",
    height: "100%",
  },
  bottomSheetContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 5,
    borderRadius: 26,
    position: "absolute",
  },
  backdrop: {},
  cardContent: {
    backgroundColor: Colors.light.secondaryBackground,
    justifyContent: "center",
    flexDirection: "column",
    padding: 24,
    borderRadius: 16,
  },
  cardHeader: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default Page;
