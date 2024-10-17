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
import type { AccessGrant, AccessGrantGroup } from "@/types/accessGrant";
import { makeApiRequest } from "./apiRequest";

export const getAccessGrants = async (): Promise<AccessGrantGroup[]> => {
  const accessGrants = await makeApiRequest<AccessGrant[]>("accessgrants");
  const groups = accessGrants.reduce(
    (result, grant) => {
      if (result[grant.webId]) {
        result[grant.webId].items.push(grant);
      } else {
        // eslint-disable-next-line no-param-reassign
        result[grant.webId] = {
          webId: grant.webId,
          logo: grant.logo,
          ownerName: grant.ownerName,
          items: [grant],
        };
      }
      return result;
    },
    {} as Record<string, AccessGrantGroup>
  );
  return Object.values(groups);
};

export const revokeAccessGrant = async (params: {
  requestId: string;
}): Promise<void> => {
  const { requestId } = params;

  const url = `accessgrants/${requestId}/revoke`;
  await makeApiRequest<Response>(url, "PUT");
};

export const revokeAccessGrantList = async (params: {
  requestId: string[];
}): Promise<void> => {
  const { requestId } = params;

  const url = `accessgrants/revoke`;
  await makeApiRequest<Response>(
    url,
    "PUT",
    JSON.stringify({
      uuids: requestId,
    })
  );
};
