import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HelpRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByText(/Requester Email/);
    await screen.findByText(/Table or Breakout Room Number/);
    await screen.findByText(/Request Time/);
    await screen.findByText(/Team ID/);
    await screen.findByText(/Explanation/);
    await screen.findByText(/Handled/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a HelpRequest", async () => {
    render(
      <Router>
        <HelpRequestForm initialContents={helpRequestFixtures.oneRequest} />
      </Router>,
    );
    await screen.findByTestId(/HelpRequestForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
  });

  // test("Correct Error messages on bad input", async () => {
  //   render(
  //     <Router>
  //       <HelpRequestForm />
  //     </Router>,
  //   );
  //   await screen.findByTestId("HelpRequestForm-requesterEmail");
  //   const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
  //   const submitButton = screen.getByTestId("HelpRequestForm-submit");

  //   fireEvent.change(requesterEmailField, { target: { value: "bad-input" } });
  //   fireEvent.click(submitButton);

  //   await screen.findByText(/Requester email must be in email format <email header>@<domain>./);
  // });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-submit");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Request time is required./);
    expect(
      screen.getByText(/Requester email is required./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Team ID is required./)).toBeInTheDocument();
    expect(
      screen.getByText(/Table or breakout room number is required./),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Explanation of request is required./),
    ).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <HelpRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-requestTime");

    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const requesterEmailField = screen.getByTestId(
      "HelpRequestForm-requesterEmail",
    );
    const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
    const tableOrBreakoutRoomField = screen.getByTestId(
      "HelpRequestForm-tableOrBreakoutRoom",
    );
    const explanationField = screen.getByTestId("HelpRequestForm-explanation");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(teamIdField, { target: { value: "F24-04" } });
    fireEvent.change(requesterEmailField, {
      target: { value: "mock-user04@icloud.com" },
    });
    fireEvent.change(tableOrBreakoutRoomField, {
      target: { value: "Table_04" },
    });
    fireEvent.change(explanationField, {
      target: { value: "Needs_help_with_team100" },
    });
    fireEvent.change(requestTimeField, {
      target: { value: "2024-01-10T12:00" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Request time must be in ISO-Date Format./),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-cancel");
    const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
