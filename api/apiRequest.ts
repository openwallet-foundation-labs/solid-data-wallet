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
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { handleErrorResponse } from "@inrupt/solid-client-errors";

export const SESSION_KEY = "session";

export const makeApiRequest = async <T>(
  endpoint: string,
  method: string = "GET",
  body: unknown = null,
  contentType: string | null = "application/json",
  isBlob: boolean = false
): Promise<T> => {
  const session = await SecureStore.getItemAsync(SESSION_KEY);
  if (!session) return {} as T;

  const headers: HeadersInit = {};

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body !== null) {
    options.body = body as BodyInit;
  }

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_WALLET_API}/${endpoint}`,
    options
  );

  if (response.status === 401) {
    router.replace(`/login?logout=${Date.now()}`);
    throw new Error(`Unauthorized: ${response.status}`);
  }

  if (!response.ok) {
    throw handleErrorResponse(
      response,
      await response.text(),
      `${endpoint} returned an error response.`
    );
  }

  if (isBlob) {
    return (await response.blob()) as unknown as T;
  }

  const responseType = response.headers.get("content-type");
  if (
    responseType?.includes("application/json") ||
    responseType?.includes("application/ld+json")
  ) {
    const result: T = await response.json();
    return result;
  }
  if (
    responseType?.includes("text/plain") ||
    responseType?.includes("text/turtle")
  ) {
    const result: T = (await response.text()) as unknown as T;
    return result;
  }

  const result: T = (await response.blob()) as unknown as T;
  return result;
};

export const objectToParams = (obj: object): string => {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  });

  return params.toString();
};
