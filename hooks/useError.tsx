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
import React, { createContext, useCallback, useState } from "react";
import ErrorPopup from "@/components/error/ErrorPopup";

const ErrorContext = createContext<{
  showErrorMsg: (msg: string) => void;
}>({
  showErrorMsg: () => null,
});

export const ErrorViewProvider = ({ children }: React.PropsWithChildren) => {
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  const showErrorMsg = useCallback((msg: string) => {
    setShowError(true);
    setErrorMsg(msg);
  }, []);

  const handleClose = useCallback(() => {
    setShowError(false);
    setErrorMsg(undefined);
  }, []);

  return (
    <ErrorContext.Provider
      value={{
        showErrorMsg,
      }}
    >
      {children}
      {showError && Boolean(errorMsg) && (
        <ErrorPopup errorMsg={errorMsg!} onClose={handleClose} />
      )}
    </ErrorContext.Provider>
  );
};

export const useError = () => React.useContext(ErrorContext);
