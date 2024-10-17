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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { formatDate } from "@/utils/dateFormatUtils";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import IconResourceName from "@/components/common/IconResourceName";
import { isWriteMode } from "@/utils/fileUtils";
import type { AccessRequestMode } from "@/types/enums";
import FieldInfo from "../common/FieldInfo";

interface CardProps {
  resourceName: string;
  resource: string;
  forPurpose: string;
  grantedDate: Date;
  expirationDate: Date;
  id: string;
  isRDFResource: boolean;
  modes: AccessRequestMode[];
  onSelect: (item: string) => void;
}

const AccessGrantCard: React.FC<CardProps> = ({
  id,
  resourceName,
  forPurpose,
  grantedDate,
  expirationDate,
  isRDFResource,
  resource,
  modes,
  onSelect,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <IconResourceName
          resourceName={resourceName}
          isRDFResource={isRDFResource}
          resourceUri={resource}
        ></IconResourceName>
        <TouchableOpacity onPress={() => onSelect(id)}>
          <FontAwesomeIcon icon={faEllipsis} size={24} />
        </TouchableOpacity>
      </View>
      <FieldInfo
        title="Access Mode"
        content={isWriteMode(modes) ? "Save to" : "View"}
      />
      <FieldInfo title="PURPOSE" content={forPurpose} />
      <FieldInfo title="ACCESS GRANTED" content={formatDate(grantedDate)} />
      <FieldInfo title="EXPIRY" content={formatDate(expirationDate)} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    padding: 16,
    marginVertical: 12,
    borderRadius: 10,
    backgroundColor: "#E7F1F7",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  fileNameCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
});

export default AccessGrantCard;
