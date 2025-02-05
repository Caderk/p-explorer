import { screen, waitFor } from "@testing-library/react";
import App from "./App";
import { renderWithProviders } from "./utils/test-utils";
import { fetchPokemon } from "./features/poketable/pokemonSlice";
import { store } from "./app/store";
import { vi } from "vitest"; // Use Vitest's vi instead of Jest

test("App should have correct initial render", async () => {
  renderWithProviders(<App />);

  // Ensure the logo and button are rendered correctly
  expect(screen.getByAltText("logo")).toBeInTheDocument();
  expect(screen.getByText("Hello world")).toBeInTheDocument();

  // Ensure the Counter component is rendered
  expect(screen.getByLabelText("Count")).toHaveTextContent("0");

  // Ensure loading state is shown initially
  expect(screen.getByRole("progressbar")).toBeInTheDocument();

  // Wait for Pokémon table to appear
  await waitFor(() => {
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  // Ensure Pokémon data is displayed
  expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
});

test("PokéTable should fetch and display Pokémon data", async () => {
  renderWithProviders(<App />);

  // Ensure loading state is shown initially
  expect(screen.getByRole("progressbar")).toBeInTheDocument();

  // Dispatch the action to simulate fetching Pokémon
  store.dispatch(fetchPokemon());

  // Wait for data to be displayed
  await waitFor(() => {
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/charmander/i)).toBeInTheDocument();
    expect(screen.getByText(/squirtle/i)).toBeInTheDocument();
  });

  // Ensure sprite images are loaded
  expect(screen.getByAltText("bulbasaur")).toBeInTheDocument();
  expect(screen.getByAltText("charmander")).toBeInTheDocument();
  expect(screen.getByAltText("squirtle")).toBeInTheDocument();
});

test("Increment value and Decrement value should work as expected", async () => {
  const { user } = renderWithProviders(<App />);

  // Click on "+" => Count should be 1
  await user.click(screen.getByLabelText("Increment value"));
  expect(screen.getByLabelText("Count")).toHaveTextContent("1");

  // Click on "-" => Count should be 0
  await user.click(screen.getByLabelText("Decrement value"));
  expect(screen.getByLabelText("Count")).toHaveTextContent("0");
});

test("PokéTable should display an error message if fetching fails", async () => {
  // Mock the fetchPokemon action to reject
  vi.spyOn(store, "dispatch").mockImplementation(() => {
    return Promise.resolve({
      type: fetchPokemon.rejected.type, // Ensuring it's a valid Redux action
      error: { message: "Failed to fetch Pokémon" },
    });
  });

  renderWithProviders(<App />);

  // Wait for the error message to appear
  await waitFor(() => {
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
  });
});