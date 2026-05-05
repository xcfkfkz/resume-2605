import { Suspense, lazy } from "react";
import { HashRouter, Routes, Route } from "react-router";
import Auth from "./components/Auth";
import AuthRoute from "./components/AuthRoute";
// import Moveable from "./components/Moveable.tsx";

const routeConfigs = [
  {
    path: "/",
    Component: lazy(() => import("./components/Home")),
  },
  {
    path: "/shelfs",
    Component: lazy(() => import("./components/Shelfs")),
  },
  {
    path: "/products",
    Component: lazy(() => import("./components/Products")),
  },
];

export default function App() {
  return (
    <HashRouter>
      {/*<Moveable initialStyle={{ position: 'absolute', top: 0, left: 0}}>444</Moveable>*/}
      <Auth>
        <Suspense fallback="loading...">
          <Routes>
            {routeConfigs.map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <AuthRoute path={path}>
                    <Component />
                  </AuthRoute>
                }
              />
            ))}
          </Routes>
        </Suspense>
      </Auth>
    </HashRouter>
  );
}
