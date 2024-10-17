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
import type { StyleProp, ViewStyle } from "react-native";
import { Image, StyleSheet, View } from "react-native";
import AccessSolid from "@/assets/images/access-solid.svg";
import { ThemedText } from "../ThemedText";

interface IComponentProps {
  logo?: string;
  webId: string;
  ownerName: string;
  containerStyle?: StyleProp<ViewStyle>;
  rightComponent?: React.ReactNode;
}

const WebIdDisplay: React.FC<IComponentProps> = ({
  logo,
  webId,
  ownerName,
  containerStyle,
  rightComponent,
}) => {
  return (
    <View style={[styles.webIdCard, containerStyle]}>
      {logo ? (
        <Image source={{ uri: logo }} style={styles.logo} />
      ) : (
        <AccessSolid style={styles.logo} />
      )}
      <View style={styles.textContainer}>
        <ThemedText style={styles.name}>{ownerName}</ThemedText>
        <ThemedText style={styles.detail}>{webId}</ThemedText>
      </View>
      {rightComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  webIdCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 40,
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

export default WebIdDisplay;
