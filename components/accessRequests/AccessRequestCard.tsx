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
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { format } from "date-fns";
import { ThemedText } from "../ThemedText";
import WebIdDisplay from "../common/WebIdDisplay";

interface CardProps {
  name: string;
  detail: string;
  logoUri?: string;
  id: string;
  issuedDate: Date;
}

const AccessRequestCard: React.FC<CardProps> = ({
  name,
  detail,
  id,
  logoUri,
  issuedDate,
}) => {
  const { navigate } = useRouter();
  return (
    <TouchableOpacity
      onPress={() => navigate(`requests/${id}`)}
      style={styles.card}
    >
      <ThemedText fontWeight="medium" style={styles.time}>
        {format(issuedDate, "MMMM d  HH:mm")}
      </ThemedText>
      <WebIdDisplay
        webId={detail}
        ownerName={name}
        logo={logoUri}
        containerStyle={{ padding: 0 }}
        rightComponent={
          <View style={styles.rightContainer}>
            <FontAwesome6 size={16} name="chevron-right" style={styles.icon} />
          </View>
        }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E7F1F7",
    paddingHorizontal: 16,
    paddingTop: 9,
    paddingBottom: 13,
    borderRadius: 10,
    marginBottom: 16,
  },
  rightContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  time: {
    fontSize: 10,
    color: Colors.light.grey,
    textAlign: "right",
    textTransform: "uppercase",
  },
  icon: {},
});

export default AccessRequestCard;
