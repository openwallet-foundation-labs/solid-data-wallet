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

import { router, Tabs } from "expo-router";
import type { MutableRefObject } from "react";
import React, { useRef, useState } from "react";
import HouseOutLine from "@/assets/images/house-outline.svg";
import AccessOutLine from "@/assets/images/access-outline.svg";
import AccessSolid from "@/assets/images/access-solid.svg";

import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { TouchableOpacity } from "react-native";
import PopupMenu from "@/components/PopupMenu";

export default function TabLayout() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const [positionType, setPositionType] = useState<
    "topMiddle" | "bottomLeft" | "bottomMiddle"
  >("bottomMiddle");
  const tabBarAddButtonRef = useRef(null);
  const rightHeaderAddButtonRef = useRef(null);
  const toggleMenu = (
    type: "topMiddle" | "bottomLeft" | "bottomMiddle" = "topMiddle",
    buttonRef: MutableRefObject<null> = rightHeaderAddButtonRef
  ) => {
    if (buttonRef && buttonRef.current) {
      (
        buttonRef.current as unknown as {
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
          setMenuVisible(!menuVisible);
        }
      );
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "black",
          tabBarLabelStyle: {
            fontFamily: "ReadexPro-Regular",
            color: "#262626",
            fontSize: 12,
          },
          headerTitleAlign: "center",
          tabBarStyle: { borderTopWidth: 0, elevation: 0 },
          headerStyle: {
            borderBottomWidth: 0,
            shadowOffset: { width: 0, height: 0 },
          },
          headerTitleStyle: { fontFamily: "ReadexPro-Regular", fontSize: 18 },
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            href: "/home",
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesome6 size={24} name="house" color={color} />
              ) : (
                <HouseOutLine width={24} height={24} />
              ),
            headerTitle: "Wallet",
            headerRight: () => (
              <TouchableOpacity
                ref={rightHeaderAddButtonRef}
                onPress={() =>
                  toggleMenu("bottomLeft", rightHeaderAddButtonRef)
                }
              >
                <FontAwesome6 size={32} name="circle-plus" />
              </TouchableOpacity>
            ),
            headerRightContainerStyle: { paddingRight: 16 },
          }}
        />

        <Tabs.Screen
          name="requests"
          options={{
            title: "Requests",
            headerTitle: "Access Requests",
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesomeIcon icon={faBell} size={24} />
              ) : (
                <FontAwesome6 size={24} name="bell" color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "Add",
            tabBarIcon: () => <FontAwesome6 size={24} name="circle-plus" />,
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                ref={tabBarAddButtonRef}
                onPress={() => toggleMenu("topMiddle", tabBarAddButtonRef)}
              />
            ),
          }}
          redirect={false}
        />
        <Tabs.Screen
          name="accesses"
          options={{
            title: "Access",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AccessSolid width={24} height={24} />
              ) : (
                <AccessOutLine width={24} height={24} />
              ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesomeIcon icon={faUser} size={24} />
              ) : (
                <FontAwesome6 size={24} name={"user"} color={color} />
              ),
          }}
        />
      </Tabs>
      <PopupMenu
        visible={menuVisible}
        onClose={() => {
          toggleMenu(
            "topMiddle",
            tabBarAddButtonRef || rightHeaderAddButtonRef
          );
        }}
        onUploadSuccess={() => {
          router.replace("/home");
        }}
        position={menuPosition}
        positionType={positionType}
      />
    </>
  );
}
