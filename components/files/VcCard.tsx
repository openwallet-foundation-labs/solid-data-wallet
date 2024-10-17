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
import { StyleSheet, View, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { addSpacesToCamelCase } from "@/utils/fileUtils";
import CheckMark from "@/assets/images/check-mark.svg";
import FieldInfo from "../common/FieldInfo";
import { ThemedText } from "../ThemedText";

interface IComponentProps {
  // disable because we are getting data dynamically base on a file
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const VcCard: React.FC<IComponentProps> = ({ data }) => {
  const { credentialSubject, issuer } = data;
  return (
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <ThemedText style={{ fontSize: 18 }}>{data?.name}</ThemedText>
        <CheckMark width={24} height={24} />
      </View>
      {credentialSubject &&
        Object.entries(credentialSubject).map((subject) => (
          <FieldInfo
            key={subject[0]}
            title={addSpacesToCamelCase(subject[0])}
            content={
              typeof subject[1] === "string" || typeof subject[1] === "number"
                ? String(subject[1])
                : ""
            }
          />
        ))}
      <View style={styles.issuerContainer}>
        <Image source={{ uri: issuer?.logo }} style={styles.issuerLogo} />

        <ThemedText
          ellipsizeMode={"tail"}
          numberOfLines={1}
          style={styles.issuerDetail}
        >
          {issuer?.name}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  issuerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 24,
  },
  issuerLogo: { width: 32, height: 32 },
  issuerDetail: {
    lineHeight: 20,
    marginLeft: 12,
  },
});

export default VcCard;
