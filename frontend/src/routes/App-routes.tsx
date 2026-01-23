import { Outlet, ScrollRestoration, type RouteObject } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";

export const AppRoutes: RouteObject = {
  element: (
    <>
      <AppLayout>
        <ScrollRestoration />
        <Outlet />
      </AppLayout>
    </>
    // </AppLayout>
  ),
  children: [
    {
      //
      path: "",
      lazy: async () => {
        const { Page } = await import("../pages/home/index");
        return { Component: Page };
      },
    },
    {
      path: "xp-details/:xpId",
      lazy: async () => {
        const { Page } = await import("../pages/xp/details");
        return { Component: Page };
      },
    },
    {
      path: "goals/:goalId",
      lazy: async () => {
        const { Page } = await import("../pages/goals/horizon-26");
        return { Component: Page };
      },
    },
  ],
};
