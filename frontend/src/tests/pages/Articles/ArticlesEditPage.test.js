import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 42,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("ArticlesEditPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/articles", { params: { id: 42 } }).reply(200, {
      id: 42,
      title: "Test Article",
      url: "http://example.com",
      explanation: "Initial explanation",
      email: "test@example.com",
      dateAdded: "2022-02-02T00:00",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesEditPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("ArticlesForm-title")).toBeInTheDocument();
    });
  });

  test("Is populated with the data provided", async () => {
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/articles", { params: { id: 42 } }).reply(200, {
      id: 42,
      title: "Test Article",
      url: "http://example.com",
      explanation: "Initial explanation",
      email: "test@example.com",
      dateAdded: "2022-02-02T00:00",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesEditPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId("ArticlesForm-title");

    const idField = screen.getByTestId("ArticlesForm-id");
    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    expect(idField).toHaveValue("42");
    expect(titleField).toHaveValue("Test Article");
    expect(urlField).toHaveValue("http://example.com");
    expect(explanationField).toHaveValue("Initial explanation");
    expect(emailField).toHaveValue("test@example.com");
    expect(dateAddedField).toHaveValue("2022-02-02T00:00");
    expect(submitButton).toBeInTheDocument();
  });

  test("Changes when you click Update", async () => {
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/articles", { params: { id: 42 } }).reply(200, {
      id: 42,
      title: "Test Article",
      url: "http://example.com",
      explanation: "Initial explanation",
      email: "test@example.com",
      dateAdded: "2022-02-02T00:00",
    });

    axiosMock.onPut("/api/articles").reply(200, {
      id: 42,
      title: "Updated Article",
      url: "http://newexample.com",
      explanation: "Updated explanation",
      email: "updated@example.com",
      dateAdded: "2023-03-03T00:00",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesEditPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId("ArticlesForm-title");

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "Updated Article" } });
    fireEvent.change(urlField, { target: { value: "http://newexample.com" } });
    fireEvent.change(explanationField, {
      target: { value: "Updated explanation" },
    });
    fireEvent.change(emailField, { target: { value: "updated@example.com" } });
    fireEvent.change(dateAddedField, { target: { value: "2023-03-03T00:00" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockToast).toBeCalled());
    expect(mockToast).toBeCalledWith(
      "Article updated - id: 42 title: Updated Article url: http://newexample.com explanation: Updated explanation email: updated@example.com dateAdded: 2023-03-03T00:00",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/articles" });

    expect(axiosMock.history.put.length).toBe(1); // times called
    expect(axiosMock.history.put[0].params).toEqual({ id: 42 });
    expect(axiosMock.history.put[0].data).toBe(
      JSON.stringify({
        title: "Updated Article",
        url: "http://newexample.com",
        explanation: "Updated explanation",
        email: "updated@example.com",
        dateAdded: "2023-03-03T00:00",
      }),
    ); // posted object
  });
});
