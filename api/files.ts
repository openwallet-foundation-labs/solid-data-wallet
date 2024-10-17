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
import mime from "mime";
import FormData from "form-data";
import type { WalletFile } from "@/types/WalletFile";
import { handleErrorResponse } from "@inrupt/solid-client-errors";
import { utf8EncodeResourceName } from "@/utils/fileUtils";
import { makeApiRequest } from "./apiRequest";

interface FileObject {
  uri: string;
  name: string;
  type?: string;
}

export const fetchFiles = async (): Promise<WalletFile[]> => {
  return makeApiRequest<WalletFile[]>("wallet");
};

export const postFile = async (fileMetadata: FileObject): Promise<void> => {
  const acceptValue = fileMetadata.type ?? mime.getType(fileMetadata.name);
  const acceptHeader = new Headers();
  if (acceptValue !== null) {
    acceptHeader.append("Accept", acceptValue);
  }
  // Make a HEAD request to the file to report on potential errors
  // in more details than the fetch with the FormData.
  const fileResponse = await fetch(fileMetadata.uri, {
    headers: acceptHeader,
    method: "HEAD",
  });
  if (!fileResponse.ok) {
    throw handleErrorResponse(
      fileResponse,
      await fileResponse.text(),
      "Failed to fetch file to upload"
    );
  }
  // The following is declared as `any` because there is a type inconsistency,
  // and the global FormData (expected by the fetch body) is actually not compliant
  // with the Web spec and its TS declarations. formData.set doesn't exist, and
  // formData.append doesn't support a Blob being passed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData: any = new FormData();
  formData.append("file", {
    name: utf8EncodeResourceName(fileMetadata.name),
    type:
      fileMetadata.type ||
      mime.getType(fileMetadata.name) ||
      "application/octet-stream",
    uri: fileMetadata.uri,
  });
  formData.append("fileName", fileMetadata.name);
  let response: Response;
  try {
    response = await fetch(
      new URL("wallet", process.env.EXPO_PUBLIC_WALLET_API),
      {
        method: "PUT",
        body: formData,
      }
    );
  } catch (e) {
    console.debug("Resolving the file and uploading it to the wallet failed.");
    throw e;
  }

  if (response.ok) {
    console.debug(
      `Uploaded file to Wallet. HTTP response status:${response.status}`
    );
  } else {
    throw handleErrorResponse(
      response,
      await response.text(),
      "Failed to upload file to Wallet"
    );
  }
};

export const deleteFile = async (fileId: string): Promise<void> => {
  return makeApiRequest<void>(`wallet/${encodeURIComponent(fileId)}`, "DELETE");
};

export const getFile = async (fileId: string): Promise<Blob> => {
  return makeApiRequest<Blob>(
    `wallet/${encodeURIComponent(fileId)}?raw=true`,
    "GET"
  );
};

export const downloadFile = async (fileId: string): Promise<Blob> => {
  return makeApiRequest<Blob>(
    `wallet/${encodeURIComponent(fileId)}?raw=true`,
    "GET",
    null,
    null,
    true
  );
};
