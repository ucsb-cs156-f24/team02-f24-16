import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

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

describe("HelpRequestEditPage tests", () => {
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
      axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Help Request");
      expect(
        screen.queryByTestId("HelpRequestForm-requesterEmail"),
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
      axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "itsjoever@gmail.com",
        teamId: "f24-00",
        tableOrBreakoutRoom: "Room 00",
        requestTime: "1969-06-09T00:00",
        explanation: "Could Table 00 get some help with ordering some WingStop?",
        solved: "false",
      });
      axiosMock.onPut("/api/helprequest").reply(200, {
        id: "17",
        requesterEmail: "itaintjoever@gmail.com",
        teamId: "f24-00",
        tableOrBreakoutRoom: "Room 00",
        requestTime: "1969-06-09T00:00",
        explanation: "Running Chicks is much better than WingStop actually, can we get that instead?",
        solved: "true",
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-requesterEmail");
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-requesterEmail");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail",
      );
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableOrBreakoutRoomField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom",
      );
      const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
      const explanationTimeField = screen.getByTestId(
        "HelpRequestForm-explanation",
      );
      const solvedTimeField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("itsjoever@gmail.com");
      expect(teamIdField).toHaveValue("f24-00");
      expect(tableOrBreakoutRoomField).toHaveValue("Room 00");
      expect(requestTimeField).toHaveValue("1969-06-09T00:00");
      expect(explanationTimeField).toHaveValue("Could Table 00 get some help with ordering some WingStop?");
      expect(solvedTimeField).toHaveValue("false");
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-requesterEmail");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail",
      );
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableOrBreakoutRoomField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom",
      );
      const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
      const explanationTimeField = screen.getByTestId(
        "HelpRequestForm-explanation",
      );
      const solvedTimeField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("itsjoever@gmail.com");
      expect(teamIdField).toHaveValue("f24-00");
      expect(tableOrBreakoutRoomField).toHaveValue("Room 00");
      expect(requestTimeField).toHaveValue("1969-06-09T00:00");
      expect(explanationTimeField).toHaveValue("Could Table 00 get some help with ordering some WingStop?");
      expect(solvedTimeField).toHaveValue("false");

      expect(submitButton).toBeInTheDocument();

      fireEvent.change(requesterEmailField, { target: { value: "itaintjoever@gmail.com" } });
      fireEvent.change(teamIdField, { target: { value: "f24-00" } });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "Room 00" },
      });
      fireEvent.change(requestTimeField, { target: { value: "1969-06-09T00:00" } });
      fireEvent.change(explanationTimeField, { target: { value: "Running Chicks is much better than WingStop actually, can we get that instead?" } });
      fireEvent.change(solvedTimeField, {
        target: { value: "true" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "HelpRequest Updated - id: 17 requesterEmail: itaintjoever@gmail.com",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "itaintjoever@gmail.com",
          teamId: "f24-00",
          tableOrBreakoutRoom: "Room 00",
          requestTime: "1969-06-09T00:00",
          explanation: "Running Chicks is much better than WingStop actually, can we get that instead?",
          solved: "true",
        }),
      ); // posted object
    });
  });
});
