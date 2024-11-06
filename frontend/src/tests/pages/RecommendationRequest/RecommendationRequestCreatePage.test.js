import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

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
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("RecommendationRequestCreatePage tests", () => {
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
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("RecommendationRequestForm-professorEmail"),
      ).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const request = {
        id: 3,
        requesterEmail: "jaydenjardine@cs.ucsb.edu",
        professorEmail: "rihanna.fenty@fentymusic.com",
        explanation: "Requesting your participation in a university event focusing on the influence of Caribbean music in pop culture.",
        dateRequested: "2024-10-31T15:30:00",
        dateNeeded: "2024-11-15T15:30:00",
        done: false,
    };

    axiosMock.onPost("/api/recommendationRequest/post").reply(202, request);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("RecommendationRequestForm-professorEmail"),
      ).toBeInTheDocument();
    });

    const testId = "RecommendationRequestTable";
    const testIdButton = "recommendationRequestTable";

    const requesterEmailField = screen.getByTestId(`${testId}-requesterEmail`);
    const professorEmailField = screen.getByTestId(`${testId}-professorEmail`);
    const explanationField = screen.getByTestId(`${testId}-explanation`);
    const dateRequestedField = screen.getByTestId(`${testId}-dateRequested`);
    const dateNeededField = screen.getByTestId(`${testId}-dateNeeded`);
    const doneField = screen.getByTestId(`${testId}-done`);


    const submitButton = screen.getByTestId(`${testIdButton}-submit`);

    fireEvent.change(requesterEmailField, { target: { value: "jaydenjardine@ucsb.edu" } });
    fireEvent.change(professorEmailField, { target: { value: "rihanna.fenty@fentymusic.com" } });
    fireEvent.change(explanationField, { target: { value: "Requesting your participation in a university event focusing on the influence of Caribbean music in pop culture." } });
    fireEvent.change(dateRequestedField, { target: { value: "2024-10-31T15:30:00" } });
    fireEvent.change(dateNeededField, { target: { value: "2024-11-15T15:30:00" } });
    fireEvent.change(doneField, { target: { value: "true" } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
        id: 3,
        requesterEmail: "jaydenjardine@cs.ucsb.edu",
        professorEmail: "rihanna.fenty@fentymusic.com",
        explanation: "Requesting your participation in a university event focusing on the influence of Caribbean music in pop culture.",
        dateRequested: "2024-10-31T15:30:00",
        dateNeeded: "2024-11-15T15:30:00",
        done: false,
    });

    expect(mockToast).toBeCalledWith(
      "New RecommendationRequest Created -  id: 3, requesterEmail: jaydenjardine@cs.ucsb.edu, professorEmail: rihanna.fenty@fentymusic.com, explanation: Requesting your participation in a university event focusing on the influence of Caribbean music in pop culture., dateRequested: 2024-10-31T15:30:00, dateNeeded: 2024-11-15T15:30:00, done: false");
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationRequest" });
  });
});
