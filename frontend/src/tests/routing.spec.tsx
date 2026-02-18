import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, Outlet } from 'react-router-dom';
import { LangingRoutes } from '../routes/Index';

describe('Display data for route', () => {
  it('renders the portfolio button on "/" route', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <Outlet />,
          children: [LangingRoutes],
        },
      ],
      {
        initialEntries: ['/'],
      }
    );

    render(<RouterProvider router={router} />);

    const button = await screen.findByRole('button', {
      name: /Découvrez mon portfolio/i,
    });

    expect(button).toBeInTheDocument();
  });
});
