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
import React, { useLayoutEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useMutation, useQuery } from "@tanstack/react-query";
import CustomButton from "@/components/Button";
import { updateAccessRequests } from "@/api/accessRequest";
import { formatDate } from "@/utils/dateFormatUtils";
import WebIdDisplay from "@/components/common/WebIdDisplay";
import type { AccessRequest } from "@/types/accessRequest";
import IconResourceName from "@/components/common/IconResourceName";
import CardInfo from "@/components/common/CardInfo";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons/faFloppyDisk";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { isAccessContainer, isWriteMode } from "@/utils/fileUtils";

const Page: React.FC = () => {
  const { requestId } = useLocalSearchParams();
  const navigation = useNavigation();
  const parentNavigation = useNavigation("/(tabs)");

  const { data = [], refetch } = useQuery<AccessRequest[]>({
    queryKey: ["accessRequests"],
    enabled: false,
  });
  const mutation = useMutation({
    mutationFn: updateAccessRequests,
    mutationKey: ["accessRequestsMutation"],
    onSuccess: async () => {
      await refetch();
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Confirm Access",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 60, paddingLeft: 8 }}
        >
          <FontAwesome6 size={20} name="chevron-left" />
        </TouchableOpacity>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  useLayoutEffect(() => {
    parentNavigation.setOptions({
      headerShown: false,
    });
    return () => {
      parentNavigation.setOptions({ headerShown: true });
    };
  }, [parentNavigation]);

  const onUpdateRequest = (action: "CONFIRM" | "DENY") => {
    mutation.mutate({ requestId: requestId as string, action });
    navigation.goBack();
  };
  const selectedRequest = data && data.find((r) => r.uuid === requestId);
  if (!selectedRequest) return null;

  const formattedExpiryDate = formatDate(selectedRequest.expirationDate);
  const { ownerName, logo, webId, modes } = selectedRequest;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title} fontWeight="medium">
          REQUESTOR
        </ThemedText>

        <WebIdDisplay
          ownerName={ownerName}
          webId={webId}
          logo={logo}
          containerStyle={{ backgroundColor: "#E7F1F7" }}
        />
        <ThemedText style={styles.title} fontWeight="medium">
          Access Mode
        </ThemedText>
        <CardInfo
          content={isWriteMode(modes) ? "Save To" : "View"}
          icon={
            <FontAwesomeIcon
              icon={isWriteMode(modes) ? faFloppyDisk : faEye}
              size={24}
            />
          }
        />
        <ThemedText style={styles.title} fontWeight="medium">
          {isAccessContainer(selectedRequest.resource)
            ? "APPLICATION"
            : "RESOURCE"}
        </ThemedText>

        <IconResourceName
          resourceName={selectedRequest.resourceName}
          resourceUri={selectedRequest.resource}
          isRDFResource={selectedRequest.isRDFResource}
          haveBackground
        />

        <ThemedText style={styles.title} fontWeight="medium">
          PURPOSE
        </ThemedText>
        <ThemedText style={styles.detail} fontWeight="regular">
          {selectedRequest.forPurpose}
        </ThemedText>
        <ThemedText style={styles.title} fontWeight="medium">
          EXPIRY
        </ThemedText>
        <ThemedText style={styles.detail} fontWeight="regular">
          {formattedExpiryDate}
        </ThemedText>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          variant="primary"
          title="Confirm Access"
          onPress={() => onUpdateRequest("CONFIRM")}
          customStyle={styles.button}
        />
        <CustomButton
          variant="secondary"
          title="Deny Access"
          onPress={() => onUpdateRequest("DENY")}
          customStyle={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#E7F1F7",
  },
  title: {
    paddingTop: 20,
    paddingBottom: 8,
    fontSize: 10,
    textTransform: "uppercase",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 12,
  },
  button: { marginBottom: 16, width: 211 },
  name: {
    fontSize: 16,
  },
  detail: {
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 30,
  },
  buttonContainer: {
    paddingTop: 16,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
});

export default Page;
