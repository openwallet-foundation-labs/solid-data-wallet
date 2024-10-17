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
import React, { useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFile } from "@/api/files";
import { FontAwesome6 } from "@expo/vector-icons";
import IconResourceName from "@/components/common/IconResourceName";
import { RDF_CONTENT_TYPE } from "@/utils/constants";
import type { WalletFile } from "@/types/WalletFile";
import { isDownloadQR } from "@/types/accessPrompt";
import { useError } from "@/hooks/useError";
import { hasProblemDetails } from "@inrupt/solid-client-errors";

interface FileDetailProps {
  file: WalletFile;
  onClose: () => void;
  onOpenMenu: (file: WalletFile) => void;
}

const Page: React.FC<FileDetailProps> = () => {
  const params = useLocalSearchParams();
  const { showErrorMsg } = useError();
  if (!isDownloadQR(params)) {
    throw new Error(
      "Incorrect params for download request: uri and contentType are required"
    );
  }
  const queryClient = useQueryClient();
  const currentNavigation = useNavigation();
  const parentNavigation = useNavigation("/(tabs)");
  const { replace } = useRouter();

  const mutation = useMutation({
    mutationFn: postFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (error) => {
      if (hasProblemDetails(error)) {
        console.debug(
          `${error.problemDetails.status}: ${error.problemDetails.title}.`
        );
        console.debug(error.problemDetails.detail);
      } else {
        console.debug("A non-HTTP error happened.");
        console.debug(error);
      }
      showErrorMsg("Unable to save the file into your Wallet.");
    },
    mutationKey: ["filesMutation"],
  });
  const fileName = params.uri?.substring(params.uri.lastIndexOf("/") + 1);
  const contentType: string = params.contentType.split(";")[0].trim();
  const isRdfFile =
    (contentType && RDF_CONTENT_TYPE.includes(contentType)) || false;
  const onSaveToWallet = async () => {
    mutation.mutate({
      uri: params.uri,
      name: fileName,
      type: params.contentType,
    });
    // This used to be goBack() but that leaves the download page on the stack so subsequent file uploads are blocked by it.
    // Using replace to return to the homepage my not be ideal, but it works (here and in the cancel handler below).
    replace("/");
  };
  useLayoutEffect(() => {
    currentNavigation.setOptions({
      headerTitleAlign: "center",
      headerTitle: "Save to Wallet",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => currentNavigation.goBack()}
          style={{ width: 60, paddingLeft: 8 }}
        >
          <FontAwesome6 size={20} name="chevron-left" />
        </TouchableOpacity>
      ),
    });
  }, [currentNavigation]);

  useEffect(() => {
    parentNavigation.setOptions({ headerShown: false });
    return () => {
      parentNavigation.setOptions({ headerShown: true });
    };
  }, [parentNavigation]);
  return (
    <View style={styles.modalContainer}>
      <View style={styles.container}>
        <View style={styles.content}>
          <ThemedText style={styles.title}>SAVE</ThemedText>
          <IconResourceName
            resourceName={fileName}
            isRDFResource={isRdfFile}
            containerStyle={{ flex: 0 }}
          />
          <ThemedText style={styles.title} fontWeight="medium">
            DOWNLOAD FROM
          </ThemedText>
          <ThemedText style={styles.detail} fontWeight="regular">
            {params.uri}
          </ThemedText>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            variant="primary"
            title="Save to Wallet"
            onPress={() => onSaveToWallet()}
            customStyle={styles.button}
          />
          <CustomButton
            variant="secondary"
            title="Cancel"
            onPress={() => replace("/")}
            customStyle={styles.button}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  fileName: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  title: {
    paddingTop: 20,
    paddingBottom: 8,
    fontSize: 10,
  },
  button: { width: 210, marginBottom: 24, paddingHorizontal: 36 },
  name: {
    fontSize: 16,
  },
  detail: {
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 30,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
});

export default Page;
