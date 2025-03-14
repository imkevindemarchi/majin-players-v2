import { createContext, JSX, ReactNode, useState } from "react";

interface IProps {
  children: ReactNode;
}

export type TLoaderContext = {
  isLoading: boolean;
  onStateChange: () => void;
};

export const LoaderContext = createContext<TLoaderContext | null>(null);

export const LoaderProvider = ({ children }: IProps): JSX.Element => {
  const [state, setState] = useState<boolean>(false);

  const isLoading: boolean = state;

  function onStateChange(): void {
    setState(!state);
  }

  return (
    <LoaderContext.Provider value={{ isLoading, onStateChange }}>
      {children}
    </LoaderContext.Provider>
  );
};
