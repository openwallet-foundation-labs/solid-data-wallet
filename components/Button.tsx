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
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import type { StyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import type { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant: "primary" | "tertiary" | "secondary";
  customStyle?: StyleProp<ViewStyle> | undefined;
  disabled?: boolean;
  testID?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  customStyle = {},
  disabled = false,
  testID,
  ...restProps
}) => {
  const buttonStyle: {
    [_key in CustomButtonProps["variant"]]: {
      backgroundColor: string;
      borderColor: string;
      borderWidth?: number;
    };
  } = {
    primary: {
      backgroundColor: "#000000",
      borderColor: "#000000",
      borderWidth: 3,
    },
    tertiary: {
      backgroundColor: "#E7F1F7",
      borderColor: "#E7F1F7",
    },
    secondary: {
      backgroundColor: "#FFFFFF",
      borderColor: "#000000",
      borderWidth: 3,
    },
  };

  const textColor = {
    primary: "#FFFFFF",
    tertiary: "#000000",
    secondary: "#000000",
  };

  return (
    <TouchableOpacity
      testID={testID}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: buttonStyle[variant].backgroundColor,
          borderColor: buttonStyle[variant].borderColor,
          borderWidth: buttonStyle[variant].borderWidth,
        },
        disabled && { backgroundColor: "grey" },
        customStyle,
      ]}
      onPress={onPress}
      {...restProps}
    >
      <Text style={[styles.text, { color: textColor[variant] }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    minWidth: 200,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "ReadexPro-Bold",
  },
});

export default CustomButton;
