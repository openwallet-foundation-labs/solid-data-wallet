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
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

interface LoadingProps {
  isLoading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={24} color="#000" />
      <ThemedText style={styles.loadingText}>Loading</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    bottom: 36,
    left: 24,
    right: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "rgba(0, 0, 0)",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5,
    borderRadius: 16,
    paddingVertical: 14,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default Loading;
