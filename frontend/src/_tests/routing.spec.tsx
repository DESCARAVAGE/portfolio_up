// Outils de rendu et de sélection DOM
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Router mémoire pour simuler la navigation sans navigateur réel
import {
  createMemoryRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";

// Configuration des routes
import { LangingRoutes } from "../routes/Index";
import { App } from "../App";
import { AppRoutes } from "../routes/App-routes";

const pause = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));


describe("Display data for route", () => {

  /**
   * Helper pour créer un router isolé par test
   */
  function renderWithRouter(initialPath = "/") {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: (
            <>
              <ScrollRestoration />
              <Outlet />
            </>
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
      ],
      {
        initialEntries: [initialPath],
      }
    );

    return render(<RouterProvider router={router} />);
  }

  /**
   * TEST 1
   * Vérifie que la landing page s'affiche correctement sur "/"
   */
  it('renders the portfolio div on "/" route', async () => {
    renderWithRouter("/");

    // findByText est nécessaire car la route est lazy (async)
    const button = await screen.findByText(/Découvrez mon portfolio/i);

    await pause(1500); // 👈 voir la landing

    expect(button).toBeInTheDocument();
  });

  /**
   * TEST 2
   * Vérifie que le clic déclenche la navigation vers "/home"
   */
  it('navigates to "/home" when clicking the div', async () => {
    const user = userEvent.setup();

    renderWithRouter("/");

    // On attend que la landing soit chargée
    const button = await screen.findByText(/Découvrez mon portfolio/i);

    // On simule un clic utilisateur
    await user.click(button);

    await pause(1500); // 👈 voir la navigation

    // On attend que la page /home soit rendue
    const homeText = await screen.findByText(/Dany SK/i);

    await pause(1500); // 👈 voir la navigation

    expect(homeText).toBeInTheDocument();
  });

});
