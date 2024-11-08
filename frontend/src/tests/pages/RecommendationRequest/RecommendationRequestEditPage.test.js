import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

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
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("RecommendationRequestEditPage tests", () => {
  const testId = "RecommendationRequestForm";
  describe("when the backend doesn't return data", () => {
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
      axiosMock
        .onGet("/api/recommendationRequest", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();

    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit recommendationRequest");
      expect(
        screen.queryByTestId(`${testId}-professorEmail`),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
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
      axiosMock
        .onGet("/api/recommendationRequest", { params: { id: 17 } })
        .reply(200, {
          id: 1,
          requesterEmail: "jaydenjardine@cs.ucsb.edu",
          professorEmail: "rihanna.fenty@fentymusic.com",
          explanation:
            "Requesting your participation in a university event focusing on the influence of Caribbean music in pop culture.",
          dateRequested: "2024-10-31T15:30:00",
          dateNeeded: "2024-11-15T15:30:00",
          done: true,
        });
      axiosMock.onPut("/api/recommendationRequest").reply(200, {
        id: 1,
        requesterEmail: "billybob@cs.ucsb.edu",
        professorEmail: "drake.ovo@ovomusic.com",
        explanation:
          "Requesting your participation in a university event focusing on rap.",
        dateRequested: "2024-10-31T15:30:00",
        dateNeeded: "2024-11-15T15:30:00",
        done: true,
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId(`${testId}-professorEmail`);
      const buttonElement = screen.getByRole("button", { name: /Update/i });
      expect(buttonElement).toBeInTheDocument();
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId(`${testId}-professorEmail`);

      const requesterEmailField = screen.getByTestId(
        `${testId}-requesterEmail`,
      );
      const professorEmailField = screen.getByTestId(
        `${testId}-professorEmail`,
      );
      const explanationField = screen.getByTestId(`${testId}-explanation`);
      const dateRequestedField = screen.getByTestId(`${testId}-dateRequested`);
      const dateNeededField = screen.getByTestId(`${testId}-dateNeeded`);
      const doneField = screen.getByTestId(`${testId}-done`);
      let itemArr = [
        requesterEmailField,
        professorEmailField,
        explanationField,
        dateRequestedField,
        dateNeededField,
        doneField,
      ];

      const submitButton = screen.getByTestId(`${testId}-submit`);

      let rec = {
        id: 1,
        requesterEmail: "jaydenjardine@cs.ucsb.edu",
        professorEmail: "rihanna.fenty@fentymusic.com",
        explanation:
          "Requesting your participation in a university event focusing on the influence of Caribbean music in pop culture.",
        dateRequested: "2024-10-31T15:30",
        dateNeeded: "2024-11-15T15:30",
        done: true,
      };

      expect(itemArr[0]).toHaveValue(rec.requesterEmail);
      expect(itemArr[1]).toHaveValue(rec.professorEmail);
      expect(itemArr[2]).toHaveValue(rec.explanation);
      expect(itemArr[3]).toHaveValue(rec.dateRequested);
      expect(itemArr[4]).toHaveValue(rec.dateNeeded);
      expect(itemArr[5]).toBeChecked(rec.done);

      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId(`${testId}-professorEmail`);

      const requesterEmailField = screen.getByTestId(
        `${testId}-requesterEmail`,
      );
      const professorEmailField = screen.getByTestId(
        `${testId}-professorEmail`,
      );
      const explanationField = screen.getByTestId(`${testId}-explanation`);
      const dateRequestedField = screen.getByTestId(`${testId}-dateRequested`);
      const dateNeededField = screen.getByTestId(`${testId}-dateNeeded`);
      const doneField = screen.getByTestId(`${testId}-done`);

      let itemArr = [
        requesterEmailField,
        professorEmailField,
        explanationField,
        dateRequestedField,
        dateNeededField,
        doneField,
      ];

      const submitButton = screen.getByTestId(`${testId}-submit`);

      let rec = {
        id: 1,
        requesterEmail: "jaydenjardine@cs.ucsb.edu",
        professorEmail: "rihanna.fenty@fentymusic.com",
        explanation:
          "Requesting your participation in a university event focusing on the influence of Caribbean music in pop culture.",
        dateRequested: "2024-10-31T15:30",
        dateNeeded: "2024-11-15T15:30",
        done: true,
      };

      expect(itemArr[0]).toHaveValue(rec.requesterEmail);
      expect(itemArr[1]).toHaveValue(rec.professorEmail);
      expect(itemArr[2]).toHaveValue(rec.explanation);
      expect(itemArr[3]).toHaveValue(rec.dateRequested);
      expect(itemArr[4]).toHaveValue(rec.dateNeeded);
      expect(itemArr[5]).toBeChecked(rec.done);

      expect(submitButton).toBeInTheDocument();

      fireEvent.change(requesterEmailField, {
        target: { value: "Jackjohn@gmail.com" },
      });
      fireEvent.change(professorEmailField, {
        target: { value: "phil@gmail.com" },
      });
      fireEvent.change(explanationField, {
        target: { value: "really cool guy" },
      });
      fireEvent.change(dateRequestedField, {
        target: { value: "2026-11-15T15:30" },
      });
      fireEvent.change(dateNeededField, {
        target: { value: "2026-12-15T15:30" },
      });
      fireEvent.change(doneField, { target: { value: "False" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "RecommendationRequest Updated - id: 1 requestor: billybob@cs.ucsb.edu professor: drake.ovo@ovomusic.com explanation: Requesting your participation in a university event focusing on rap. status: true date requested: 2024-10-31T15:30:00 date needed by 2024-11-15T15:30:00",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/recommendationRequest" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "Jackjohn@gmail.com",
          professorEmail: "phil@gmail.com",
          explanation: "really cool guy",
          done: true,
          dateRequested: "2026-11-15T15:30",
          dateNeeded: "2026-12-15T15:30",
        }),
      ); // posted object
    });
  });
});
