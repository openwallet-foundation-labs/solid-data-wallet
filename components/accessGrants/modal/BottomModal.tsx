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
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import IconResourceName from "@/components/common/IconResourceName";
import WebIdDisplay from "@/components/common/WebIdDisplay";
import type { AccessGrant, AccessGrantGroup } from "@/types/accessGrant";

interface BottomModalProps {
  accessGrant?: AccessGrant;
  accessGrantGroup?: AccessGrantGroup;
  onRevoke?: (accessGrant: AccessGrant | AccessGrantGroup) => void;
}

const BottomModal: React.FC<BottomModalProps> = ({
  accessGrant,
  accessGrantGroup,
  onRevoke = () => {},
}) => {
  return (
    <BottomSheetView style={styles.bottomSheetContent}>
      <View style={styles.fileDetailedTitle}>
        {accessGrantGroup && (
          <WebIdDisplay
            webId={accessGrantGroup.webId}
            ownerName={accessGrantGroup.ownerName}
            logo={accessGrantGroup.logo}
            containerStyle={{ padding: 0 }}
          />
        )}
        {accessGrant && (
          <IconResourceName
            resourceName={accessGrant.resourceName}
            isRDFResource={accessGrant.isRDFResource}
            resourceUri={accessGrant.resource}
          ></IconResourceName>
        )}
      </View>
      <TouchableOpacity
        style={styles.fileDetailMenuContainer}
        onPress={() => onRevoke(accessGrant!)}
      >
        <FontAwesome6 size={24} name="trash" />
        <ThemedText style={{ paddingLeft: 24, fontSize: 16 }}>
          {accessGrantGroup ? "Revoke all access" : "Revoke access"}
        </ThemedText>
      </TouchableOpacity>
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
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
});

export default BottomModal;
