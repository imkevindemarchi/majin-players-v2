import { ReactNode, useContext } from "react";
import { Navigate, Route, Routes } from "react-router";

// Assets
import { ADMIN_ROUTES, IRoute, ROUTES } from "./routes";

// Components
import { Layout } from "./components";

// Contexts
import { AuthContext, TAuthContext } from "./providers/auth.provider";

interface IProtectedRoute {
  children: ReactNode;
}

const App = () => {
  const { isUserAuthenticated }: TAuthContext = useContext(
    AuthContext
  ) as TAuthContext;

  const ProtectedRoute = ({ children }: IProtectedRoute): any => {
    if (isUserAuthenticated) return children;
    else return <Navigate to="/log-in" replace />;
  };

  const routeElement = (route: IRoute): any =>
    route.path === "/log-in" && isUserAuthenticated ? (
      <Navigate to="/admin" replace />
    ) : (
      route.element
    );

  return (
    <Layout>
      <Routes>
        {ROUTES.map((route: IRoute, index: number) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={routeElement(route)}
            />
          );
        })}
        {ADMIN_ROUTES.map((adminRoute: IRoute, index: number) => {
          return (
            <Route
              key={index}
              path={adminRoute.path}
              element={<ProtectedRoute>{adminRoute.element}</ProtectedRoute>}
            />
          );
        })}
      </Routes>
    </Layout>
  );
};

export default App;
