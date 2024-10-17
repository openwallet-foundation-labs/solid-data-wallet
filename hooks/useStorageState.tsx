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
import { useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

type UseStateHook<T> = [T | undefined, (value: T | null) => void];

function useAsyncState<T>(initialState?: T): UseStateHook<T> {
  const [state, setState] = useState<T | undefined>(initialState);
  const setAsyncState = useCallback(
    (value: T | null) => {
      setState(value ?? undefined);
    },
    [setState]
  );
  return [state, setAsyncState];
}

function setStorageItemAsync(key: string, value: string | null): void {
  if (value === null) {
    SecureStore.deleteItemAsync(key).catch((e) => {
      // eslint-disable-next-line no-console
      console.error("Something wrong while deleting key:", e);
    });
  } else {
    SecureStore.setItemAsync(key, value).catch((e) => {
      // eslint-disable-next-line no-console
      console.error("something wrong while logout:", e);
    });
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    SecureStore.getItemAsync(key).catch(() =>
      // eslint-disable-next-line no-console
      console.error(`Can not get data with key:${key}`)
    );
  }, [key, setState]);

  const setValue = useCallback(
    async (value: string | null) => {
      setState(value);
      try {
        await setStorageItemAsync(key, value);
      } catch (error) {
        /* empty */
      }
    },
    [key, setState]
  );

  return [state, setValue];
}
