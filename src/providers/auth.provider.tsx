import {
  createContext,
  JSX,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router";

// Api
import { AUTH_API } from "../api";

// Contexts
import { LoaderContext, TLoaderContext } from "./loader.provider";

// Types
import { THTTPResponse } from "../types";

// Utils
import { getFromStorage, setToStorage } from "../utils";

interface IProps {
  children: ReactNode;
}

export type TAuthContext = {
  isUserAuthenticated: boolean;
  setIsUserAuthenticated: (value: boolean) => void;
};

export const AuthContext = createContext<TAuthContext | null>(null);

export const AuthProvider = ({ children }: IProps): JSX.Element => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(
    getFromStorage("token") ? true : false
  );
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const currentPathSection: string = useLocation().pathname.split("/")[1];
  const isAdminSection: boolean = currentPathSection.split("/")[0] === "admin";

  async function onLoad() {
    setIsLoading(true);

    await Promise.resolve(AUTH_API.checkSession()).then(
      (response: THTTPResponse) => {
        if (response.hasSuccess) {
          setToStorage("token", response.data?.access_token);
          setIsUserAuthenticated(true);
        } else setIsUserAuthenticated(false);
      }
    );

    setIsLoading(false);
  }

  useEffect(() => {
    isAdminSection && onLoad();

    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{ isUserAuthenticated, setIsUserAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
