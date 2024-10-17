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
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";

interface IComponentProps {
  content: string;
  icon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const CardInfo: React.FC<IComponentProps> = ({
  content,
  icon,
  containerStyle = {},
}) => {
  return (
    <View style={[styles.fileNameCardHeader, containerStyle]}>
      {icon}

      <ThemedText
        ellipsizeMode={"tail"}
        numberOfLines={1}
        style={styles.detail}
      >
        {content}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  fileNameCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#E7F1F7",
    borderRadius: 16,
  },
  detail: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    marginLeft: 12,
  },
});

export default CardInfo;
