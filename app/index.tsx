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
import { Redirect } from "expo-router";
import { useLoginWebView } from "@/hooks/useInruptLogin";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { UserInfo } from "@/constants/user";
import { getUserInfo, signup } from "@/api/user";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const { isLoggedIn } = useLoginWebView();
  const loggedIn = isLoggedIn();

  const {
    isFetching,
    data: userInfo,
    refetch,
  } = useQuery<UserInfo>({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    enabled: loggedIn,
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: async () => {
      setIsShowSplash(false);
      await refetch();
    },
    onError: () => {
      setIsShowSplash(true);
    },
  });

  useEffect(() => {
    if (userInfo && userInfo.signupRequired && loggedIn) {
      signupMutation.mutateAsync().catch((error) => {
        console.error("Error while signup", error);
      });
    }
  }, [userInfo, loggedIn, signupMutation]);

  if (!loggedIn) {
    return <Redirect href="/login" />;
  }

  if (isFetching || !userInfo || (userInfo.signupRequired && isShowSplash)) {
    return (
      <View style={styles.container}>
        {!isFetching && (
          <Image
            // eslint-disable-next-line global-require
            source={require("../assets/images/signup-splash.png")}
            style={styles.image}
          />
        )}
      </View>
    );
  }

  return <Redirect href="/home" />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width,
    height,
    resizeMode: "cover",
  },
});

export default HomeScreen;
