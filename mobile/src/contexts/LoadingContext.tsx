import { 
  createContext, 
  useContext, 
  useState 
} from "react";

interface LoadingContextData {
  loading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextData>(
  {} as LoadingContextData
);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(false);

  function showLoading() {
    setLoading(true);
  }

  function hideLoading() {
    setLoading(false);
  }

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}