import { Outlet, ScrollRestoration , type RouteObject } from 'react-router-dom';

export const LangingRoutes: RouteObject = {
    element: (
        <>
          <ScrollRestoration />
          <Outlet />
        </>
    ),
    children: [
        {
            path: '',
            lazy: async () => {
                const { Page } = await import('../pages/landing/index');
                return { Component: Page };
            }
        },
        {
            path: '*',
            lazy: async () => {
                const { Page } = await import('../pages/notfound/index');
                return { Component: Page };
            }
        },
    ]
}