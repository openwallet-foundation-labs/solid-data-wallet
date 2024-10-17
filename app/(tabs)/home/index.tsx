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
import CustomButton from "@/components/Button";
import PopupMenu from "@/components/PopupMenu";
import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchFiles } from "@/api/files";
import FileList from "@/components/files/FileList";
import useRefreshOnFocus from "@/hooks/useRefreshOnFocus";
import { Colors } from "@/constants/Colors";
import type { WalletFile } from "@/types/WalletFile";

const HomeScreen = () => {
  const { data, isLoading, isFetching, refetch } = useQuery<WalletFile[]>({
    queryKey: ["files"],
    queryFn: fetchFiles,
    enabled: false,
  });

  useEffect(() => {
    refetch().catch((err) => console.error(err));
    return () => {
      console.debug("Unmount HomeScreen");
    };
  }, [refetch]);

  useRefreshOnFocus(refetch);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [positionType, setPositionType] = useState<
    "topMiddle" | "bottomLeft" | "bottomMiddle"
  >("bottomMiddle");
  const addButtonRef = useRef(null);

  const toggleMenu = (type: "topMiddle" | "bottomLeft" | "bottomMiddle") => {
    if (addButtonRef && addButtonRef.current) {
      // Because addButtonRef is passed as the `ref` prop of a component,
      // addButtonRef.current references the component itself.
      (
        addButtonRef.current as unknown as {
          measure: (
            callback: (
              _fx: number,
              _fy: number,
              _width: number,
              _height: number,
              px: number,
              py: number
            ) => void
          ) => void;
        }
      ).measure(
        (
          _fx: number,
          _fy: number,
          _width: number,
          _height: number,
          px: number,
          py: number
        ) => {
          setMenuPosition({ x: px, y: py });
          setPositionType(type);
          setMenuVisible(true);
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      {(data && data.length > 0) || isLoading ? (
        <FileList
          files={data}
          isLoading={isLoading || isFetching}
          onRefresh={() => refetch()}
          refreshing={false}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <ThemedText style={styles.text}>
            Add your own data, such as photos, files, or notes.
          </ThemedText>
          <TouchableOpacity ref={addButtonRef}>
            <CustomButton
              variant="tertiary"
              title="Add Data"
              onPress={() => toggleMenu("topMiddle")}
              testID="default-add-button"
            ></CustomButton>
          </TouchableOpacity>
        </View>
      )}

      <PopupMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onUploadSuccess={refetch}
        position={menuPosition}
        positionType={positionType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
  emptyStateContainer: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingHorizontal: 70,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 28,
    color: Colors.light.grey,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  list: {
    flexGrow: 1,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});

export default HomeScreen;
