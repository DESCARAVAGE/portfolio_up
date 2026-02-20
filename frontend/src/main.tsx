import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { App } from "./App";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import { AppRoutes } from "./routes/App-routes";
import { LangingRoutes } from "./routes/Index";

const root = createRoot(document.getElementById("root")!);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollRestoration />
        <Outlet />
      </>
      // </App>
    ),
    children: [LangingRoutes],
  },
  {
    path: "/home",
    element: (
      <App>
        <ScrollRestoration />
        <Outlet />
      </App>
    ),
    children: [AppRoutes],
  },
]);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
