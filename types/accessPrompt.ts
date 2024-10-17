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
export interface AccessPromptQR {
  webId: string;
  client: string;
  type: string;
}

export function isAccessPromptQR(
  qr: unknown | AccessPromptQR
): qr is AccessPromptQR {
  return (
    isValidUrl((qr as AccessPromptQR).webId) &&
    typeof (qr as AccessPromptQR).client === "string" &&
    typeof (qr as AccessPromptQR).type === "string"
  );
}

export interface AccessPromptResource {
  webId: string;
  resource: string;
  resourceName: string;
  logo: string;
  ownerName: string;
}

export interface DownloadQR {
  uri: string;
  contentType: string;
}

export function isDownloadQR(qr: unknown | DownloadQR): qr is DownloadQR {
  return (
    isValidUrl((qr as DownloadQR).uri) &&
    typeof (qr as DownloadQR).contentType === "string"
  );
}

const isValidUrl = (str: string): boolean => {
  try {
    return Boolean(new URL(str));
  } catch {
    return false;
  }
};
