import { Route, Routes } from "react-router";

// Components
import { Layout } from "./components";
import { IRoute, ROUTES } from "./routes";

const App = () => {
  return (
    <Layout>
      <Routes>
        {ROUTES.map((route: IRoute, index: number) => {
          return (
            <Route key={index} path={route.path} element={route.element} />
          );
        })}
      </Routes>
    </Layout>
  );
};

export default App;
