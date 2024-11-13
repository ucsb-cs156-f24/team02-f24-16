import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RecommendationRequestTable tests", () => {
  const queryClient = new QueryClient();

  // @Parameter(name="requesterEmail") @RequestParam String requesterEmail,
  // @Parameter(name="professorEmail") @RequestParam String professorEmail,
  // @Parameter(name="explanation") @RequestParam String explanation,
  // @Parameter(name="done") @RequestParam Boolean done,
  // @Parameter(name="dateRequested", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("dateRequested") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateRequested,
  // @Parameter(name="dateNeeded", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("dateNeeded") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateNeeded

  const expectedHeaders = [
    "id",
    "Requester Email",
    "Professor Email",
    "Explanation",
    "Finished",
    "Date Requested",
    "Date Needed By",
  ];
  const expectedFields = [
    "id",
    "requesterEmail",
    "professorEmail",
    "explanation",
    "done",
    "dateRequested",
    "dateNeeded",
  ];
  const testId = "RecommendationRequestTable";
  const testIdButton = "recommendationRequestTable";

  test("renders empty table correctly", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable requests={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(
        `${testId}-cell-row-0-col-${field}`,
      );
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            requests={recommendationRequestFixtures.threeRecommendationRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const threeRR = recommendationRequestFixtures.threeRecommendationRequests;
    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    //   expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
    //     "2",
    //   );
    //   expect(
    //     screen.getByTestId(`${testId}-cell-row-0-col-name`),
    //   ).toHaveTextContent("Cristino's Bakery");

    //   expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
    //     "3",
    //   );
    //   expect(
    //     screen.getByTestId(`${testId}-cell-row-1-col-name`),
    //   ).toHaveTextContent("Freebirds");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      threeRR[0].id,
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateNeeded`),
    ).toHaveTextContent(threeRR[0].dateNeeded);

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateRequested`),
    ).toHaveTextContent(threeRR[0].dateRequested);

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-done`),
    ).toHaveTextContent("✕");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-explanation`),
    ).toHaveTextContent(threeRR[0].explanation);

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-professorEmail`),
    ).toHaveTextContent(threeRR[0].professorEmail);

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`),
    ).toHaveTextContent(threeRR[0].requesterEmail);

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      threeRR[1].id,
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-dateNeeded`),
    ).toHaveTextContent(threeRR[1].dateNeeded);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-dateRequested`),
    ).toHaveTextContent(threeRR[1].dateRequested);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-done`),
    ).toHaveTextContent("✓");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-explanation`),
    ).toHaveTextContent(threeRR[1].explanation);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-professorEmail`),
    ).toHaveTextContent(threeRR[1].professorEmail);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-requesterEmail`),
    ).toHaveTextContent(threeRR[1].requesterEmail);

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      threeRR[2].id,
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-dateNeeded`),
    ).toHaveTextContent(threeRR[2].dateNeeded);

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-dateRequested`),
    ).toHaveTextContent(threeRR[2].dateRequested);

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-done`),
    ).toHaveTextContent("✕");

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-explanation`),
    ).toHaveTextContent(threeRR[2].explanation);

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-professorEmail`),
    ).toHaveTextContent(threeRR[2].professorEmail);

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-requesterEmail`),
    ).toHaveTextContent(threeRR[2].requesterEmail);

    const editButton = screen.getByTestId(
      `${testIdButton}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `recommendationRequestTable-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            requests={recommendationRequestFixtures.threeRecommendationRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const threeRR = recommendationRequestFixtures.threeRecommendationRequests;
    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      threeRR[0].id,
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateNeeded`),
    ).toHaveTextContent(threeRR[0].dateNeeded);

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateRequested`),
    ).toHaveTextContent(threeRR[0].dateRequested);

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-done`),
    ).toHaveTextContent("✕");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-explanation`),
    ).toHaveTextContent(threeRR[0].explanation);

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-professorEmail`),
    ).toHaveTextContent(threeRR[0].professorEmail);

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`),
    ).toHaveTextContent(threeRR[0].requesterEmail);

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      threeRR[1].id,
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-dateNeeded`),
    ).toHaveTextContent(threeRR[1].dateNeeded);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-dateRequested`),
    ).toHaveTextContent(threeRR[1].dateRequested);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-done`),
    ).toHaveTextContent("✓");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-explanation`),
    ).toHaveTextContent(threeRR[1].explanation);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-professorEmail`),
    ).toHaveTextContent(threeRR[1].professorEmail);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-requesterEmail`),
    ).toHaveTextContent(threeRR[1].requesterEmail);

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      threeRR[2].id,
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-dateNeeded`),
    ).toHaveTextContent(threeRR[2].dateNeeded);

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-dateRequested`),
    ).toHaveTextContent(threeRR[2].dateRequested);

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-done`),
    ).toHaveTextContent("✕");

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-explanation`),
    ).toHaveTextContent(
      "Requesting your participation in a university event focusing on the influence of Caribbean music in pop culture.",
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-professorEmail`),
    ).toHaveTextContent(threeRR[2].professorEmail);

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-requesterEmail`),
    ).toHaveTextContent(threeRR[2].requesterEmail);

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  //   test("Has the expected column headers, content for ordinary user", () => {
  //     // arrange
  //     const currentUser = currentUserFixtures.userOnly;

  //     // act
  //     render(
  //       <QueryClientProvider client={queryClient}>
  //         <MemoryRouter>
  //           <RecommendationRequestTable
  //             threeRR={recommendationRequestFixtures.threeRecommendationRequests}
  //             currentUser={currentUser}
  //           />
  //         </MemoryRouter>
  //       </QueryClientProvider>
  //     );

  //     // assert
  //     expectedHeaders.forEach((headerText) => {
  //       const header = screen.getByText(headerText);
  //       expect(header).toBeInTheDocument();
  //     });

  //     expectedFields.forEach((field) => {
  //       const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
  //       expect(header).toBeInTheDocument();
  //     });

  //     expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
  //       "2"
  //     );
  //     expect(
  //       screen.getByTestId(`${testId}-cell-row-0-col-name`)
  //     ).toHaveTextContent("Cristino's Bakery");

  //     expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
  //       "3"
  //     );
  //     expect(
  //       screen.getByTestId(`${testId}-cell-row-1-col-name`)
  //     ).toHaveTextContent("Freebirds");

  //     expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  //     expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  //   });

  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            requests={recommendationRequestFixtures.threeRecommendationRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert - check that the expected content is rendered
    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-professorEmail`),
    ).toHaveTextContent("taylor.alison@recordlabel.com");

    const editButton = screen.getByTestId(
      `${testIdButton}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith(
        "/recommendationRequest/edit/1",
      ),
    );
  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/recommendationRequest")
      .reply(200, { message: "Recommendation Request deleted" });

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            requests={recommendationRequestFixtures.threeRecommendationRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert - check that the expected content is rendered
    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-professorEmail`),
    ).toHaveTextContent("taylor.alison@recordlabel.com");

    const deleteButton = screen.getByTestId(
      `recommendationRequestTable-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);

    // assert - check that the delete endpoint was called

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });
});
