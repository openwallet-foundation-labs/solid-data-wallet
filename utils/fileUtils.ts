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
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import { faIdCard } from "@fortawesome/free-solid-svg-icons/faIdCard";
import { faWallet } from "@fortawesome/free-solid-svg-icons/faWallet";
import { AccessRequestMode } from "@/types/enums";
import type { WalletFile } from "@/types/WalletFile";

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const extension = filename?.split(".")?.pop()?.toLowerCase();
  return extension ? imageExtensions.includes(extension) : false;
};

export const isDisplayDetailedPage = (file: WalletFile) => {
  return isImageFile(file.fileName) || file.isRDFResource;
};

export const addSpacesToCamelCase = (camelString: string) => {
  return camelString.replace(/([a-z])([A-Z])/g, "$1 $2");
};

export const getIconFile = (
  fileName: string,
  isRDFResource: boolean = false
) => {
  if (fileName.endsWith("/")) {
    return faWallet;
  }
  if (isRDFResource) return faIdCard;

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const extension = fileName.split(".")?.pop()?.toLowerCase();
  if (extension) {
    if (imageExtensions.includes(extension)) return faImage;
  }
  return faFile;
};

export const isAccessContainer = (resourceUri: string) =>
  resourceUri.endsWith("/");

export const formatResourceName = (
  resource: string,
  isRDFResource: boolean,
  resourceUri: string = ""
): string => {
  let newResource = resource;
  let isContainer = false;
  if (resourceUri && resourceUri.endsWith("/")) {
    isContainer = true;
  }
  if (newResource.endsWith("/")) {
    newResource = newResource.slice(0, -1);
  }

  const parts = newResource.split("/");
  let lastPart = parts[parts.length - 1];
  if (isRDFResource && lastPart.includes(".")) {
    lastPart = lastPart.split(".").slice(0, -1).join(".");
  } else if (isContainer) {
    lastPart = capitalize(lastPart);
  }
  return lastPart;
};

export const utf8EncodeResourceName = (input: string) => {
  // encodeURIComponent() does not encode !'()*, so we manually do. This is
  // required because these characters are allowed in resource names but not
  // supported unencoded by the backend. For more details, see
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_content-disposition_and_link_headers
  return encodeURIComponent(input).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16)}`
  );
};

export const isWriteMode = (modes: AccessRequestMode[]) =>
  modes.some((mode) => mode === AccessRequestMode.Write);
