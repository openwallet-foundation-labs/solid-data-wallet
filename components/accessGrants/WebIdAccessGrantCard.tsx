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
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import AccessSolid from "@/assets/images/access-solid.svg";
import { ThemedText } from "../ThemedText";

interface CardProps {
  name: string;
  detail: string;
  logoUri?: string;
  id: string;
}

const WebIdAccessGrantCard: React.FC<CardProps> = ({
  name,
  detail,
  id,
  logoUri,
}) => {
  const { navigate } = useRouter();
  const encoded = encodeURIComponent(id);
  return (
    <TouchableOpacity onPress={() => navigate(`accesses/${encoded}`)}>
      <View style={styles.card}>
        {logoUri ? (
          <Image
            source={{ uri: logoUri }}
            style={styles.logo}
            borderRadius={40}
          />
        ) : (
          <AccessSolid style={styles.logo} width={40} height={40} />
        )}
        <View style={styles.textContainer}>
          {name && <ThemedText style={styles.name}>{name}</ThemedText>}
          <ThemedText style={styles.detail}>{detail}</ThemedText>
        </View>
        <FontAwesome6 size={18} name="chevron-right" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginVertical: 12,
    borderRadius: 10,
    backgroundColor: "#E7F1F7",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    lineHeight: 22,
  },
  detail: {
    fontSize: 14,
    lineHeight: 18,
  },
});

export default WebIdAccessGrantCard;
