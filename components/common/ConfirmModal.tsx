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
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/Button";

interface ConfirmModalProps {
  visible: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  confirmLabel: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  content,
  visible,
  onConfirm,
  confirmLabel,
  onClose = () => {},
}) => {
  const [modalVisible, setModalVisible] = useState(visible);

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ThemedText style={styles.header}>{title}</ThemedText>
            <ThemedText style={styles.description} fontWeight="light">
              {content}
            </ThemedText>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <CustomButton
                  variant="primary"
                  title={confirmLabel}
                  customStyle={{ paddingHorizontal: 16 }}
                  onPress={onConfirm}
                />
              </View>
              <View style={styles.button}>
                <CustomButton
                  variant="secondary"
                  title="Cancel"
                  onPress={() => {
                    setModalVisible(false);
                    onClose();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
  },
  modalView: {
    width: "88%",
    backgroundColor: "white",
    borderRadius: 18,
    padding: 24,
    margin: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 18,
  },
  description: {
    paddingTop: 16,
    paddingBottom: 48,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  button: { paddingBottom: 24 },
});

export default ConfirmModal;
