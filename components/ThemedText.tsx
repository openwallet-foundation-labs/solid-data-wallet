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
import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  fontWeight?: "regular" | "semiBold" | "medium" | "bold" | "light";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  fontWeight = "regular",
  ...rest
}: ThemedTextProps) {
  const color = lightColor;
  return (
    <Text
      style={[
        { color },
        fontWeight === "regular"
          ? { fontFamily: "ReadexPro-Regular" }
          : undefined,
        fontWeight === "semiBold"
          ? { fontFamily: "ReadexPro-SemiBold" }
          : undefined,
        fontWeight === "medium"
          ? { fontFamily: "ReadexPro-Medium" }
          : undefined,
        fontWeight === "bold" ? { fontFamily: "ReadexPro-Bold" } : undefined,
        fontWeight === "light" ? { fontFamily: "ReadexPro-Light" } : undefined,
        { fontSize: 16 },
        style,
      ]}
      {...rest}
    />
  );
}
