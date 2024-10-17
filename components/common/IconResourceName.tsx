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
import type { ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import type { StyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import { formatResourceName, getIconFile } from "@/utils/fileUtils";
import { ThemedText } from "../ThemedText";

interface IComponentProps {
  resourceName: string;
  isRDFResource?: boolean;
  haveBackground?: boolean;
  resourceUri?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const IconResourceName: React.FC<IComponentProps> = ({
  resourceName,
  isRDFResource = false,
  haveBackground = false,
  resourceUri = "",
  containerStyle = {},
}) => {
  return (
    <View
      style={[
        styles.fileNameCardHeader,
        haveBackground ? styles.background : { flex: 1 },
        containerStyle,
      ]}
    >
      <FontAwesomeIcon
        icon={getIconFile(resourceUri, isRDFResource)}
        style={styles.icon}
        size={24}
      />

      <ThemedText ellipsizeMode={"tail"} numberOfLines={1}>
        {formatResourceName(resourceName, isRDFResource, resourceUri)}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  fileNameCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    // paddingVertical: 16,
    // paddingHorizontal: 24,
    // backgroundColor: "#E7F1F7",
    borderRadius: 16,
  },
  background: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: "#E7F1F7",
    borderRadius: 16,
  },

  icon: {
    marginRight: 12,
  },
  detail: {
    flex: 1,
    lineHeight: 22,
  },
});

export default IconResourceName;
