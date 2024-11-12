import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
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

describe("HelpRequestCreatePage tests", () => {
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
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("HelpRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const helpRequest = {
      id: 1,
      requesterEmail: "karenkevin@gmail.com",
      teamId: "f24-02",
      tableOrBreakoutRoom: "Room 0",
      requestTime: "1987-04-20T00:00",
      explanation: "I'm in need of some flour and eggs!! COookiiesss!!!",
      solved: "true",
    };

    axiosMock.onPost("/api/helprequest/post").reply(202, helpRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("HelpRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });

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

    fireEvent.change(requesterEmailField, {
      target: { value: "karenkevin@gmail.com" },
    });
    fireEvent.change(teamIdField, { target: { value: "f24-02" } });
    fireEvent.change(tableOrBreakoutRoomField, {
      target: { value: "Room 0" },
    });
    fireEvent.change(requestTimeField, {
      target: { value: "1987-04-20T00:00" },
    });
    fireEvent.change(explanationTimeField, {
      target: { value: "I'm in need of some flour and eggs!! COookiiesss!!!" },
    });
    fireEvent.change(solvedTimeField, {
      target: { value: "true" },
    });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "karenkevin@gmail.com",
      teamId: "f24-02",
      tableOrBreakoutRoom: "Room 0",
      requestTime: "1987-04-20T00:00",
      explanation: "I'm in need of some flour and eggs!! COookiiesss!!!",
      solved: "true",
    });

    expect(mockToast).toBeCalledWith(
      "New helpRequest Created - id: 1 requesterEmail: karenkevin@gmail.com",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });
  });
});
