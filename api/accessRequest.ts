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
import type { AccessRequest } from "@/types/accessRequest";
import { makeApiRequest } from "./apiRequest";

export const getAccessRequests = async (): Promise<AccessRequest[]> => {
  return makeApiRequest<AccessRequest[]>("inbox");
};

export const updateAccessRequests = async (params: {
  requestId: string;
  action: "CONFIRM" | "DENY";
}): Promise<void> => {
  const { action, requestId } = params;

  const url = `inbox/${requestId}/${action === "CONFIRM" ? "grantAccess" : "denyAccess"}`;
  await makeApiRequest<AccessRequest[]>(url, "PUT");
};
