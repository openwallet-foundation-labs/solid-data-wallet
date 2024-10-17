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
import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/Button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FontAwesome6 } from "@expo/vector-icons";
import WebIdDisplay from "@/components/common/WebIdDisplay";
import { Colors } from "@/constants/Colors";
import {
  getAccessPromptResource,
  requestAccessPrompt,
} from "@/api/accessPrompt";
import type { AccessPromptResource } from "@/types/accessPrompt";
import { isAccessPromptQR } from "@/types/accessPrompt";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import CardInfo from "@/components/common/CardInfo";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Loading from "@/components/LoadingButton";
import { hasProblemDetails } from "@inrupt/solid-client-errors";

const Page: React.FC = () => {
  const params = useLocalSearchParams();

  if (!isAccessPromptQR(params)) {
    throw new Error(
      "Incorrect params for access prompt request: webId, client and type are required"
    );
  }
  const router = useRouter();
  const { data, error, isLoading, isFetching } = useQuery<AccessPromptResource>(
    {
      queryKey: ["accessPromptResource"],
      queryFn: () =>
        getAccessPromptResource({
          type: params.type,
          webId: params.webId,
        }),
    }
  );
  const navigation = useNavigation();
  const mutation = useMutation({
    mutationFn: requestAccessPrompt,
    mutationKey: ["createAccessPromptRequest"],
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: "center",
      headerTitle: "Confirm Resource to Share",
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 60, paddingLeft: 8 }}
        >
          <FontAwesome6 size={20} name="chevron-left" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const onConfirmResourceToShare = (): void => {
    if (!data) return;
    mutation.mutate({
      resource: data.resource,
      client: params.client,
    });
    router.replace({
      pathname: "/access-prompt/confirmed",
      params: {
        webId: params.webId,
        resourceName: data.resourceName,
        ownerName: data.ownerName,
        logo: data.logo,
      },
    });
  };

  if (
    error !== null &&
    hasProblemDetails(error) &&
    error.problemDetails.status === 404
  ) {
    return (
      <View style={styles.emptyState}>
        <ThemedText style={styles.emptyStateText}>
          Resource not found
        </ThemedText>
      </View>
    );
  }

  if (isLoading || isFetching)
    return (
      <View style={styles.container}>
        <Loading isLoading={true} />
      </View>
    );

  if (!data) return <View style={styles.container} testID="no-prompts" />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title} fontWeight="medium">
          REQUESTOR
        </ThemedText>

        <WebIdDisplay
          ownerName={data?.ownerName || ""}
          webId={params.webId}
          containerStyle={{
            backgroundColor: Colors.light.secondaryBackground,
          }}
          logo={data?.logo || ""}
        />
        <ThemedText style={styles.title} fontWeight="medium">
          Access Mode
        </ThemedText>
        <CardInfo
          content={"View"}
          icon={<FontAwesomeIcon icon={faEye} size={24} />}
        />
        <ThemedText style={styles.title} fontWeight="medium">
          Resource to share
        </ThemedText>
        <View style={styles.resourceNameContainer}>
          <ThemedText style={styles.name} fontWeight="medium">
            {data?.resourceName}
          </ThemedText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          variant="primary"
          title="Confirm"
          onPress={() => onConfirmResourceToShare()}
          customStyle={styles.button}
        />
        <CustomButton
          variant="secondary"
          title="Cancel"
          onPress={() => router.back()}
          customStyle={styles.button}
        />
      </View>
      <Loading isLoading={isLoading || isFetching} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    color: Colors.light.grey,
  },
  title: {
    paddingTop: 20,
    paddingBottom: 8,
    fontSize: 10,
    textTransform: "uppercase",
  },
  button: { width: 210, marginBottom: 24, paddingHorizontal: 36 },
  name: {
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  resourceNameContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderColor: "#DFE9F0",
    borderWidth: 1.45,
  },
});

export default Page;
