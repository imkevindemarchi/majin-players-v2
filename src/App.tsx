import { Route, Routes } from "react-router";

// Components
import { Layout } from "./components";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<div></div>}></Route>
      </Routes>
    </Layout>
  );
};

export default App;
