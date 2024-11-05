import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RecommendationRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByText(/Requester Email/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a RecommendationRequest", async () => {
    render(
      <Router>
        <RecommendationRequestForm
          initialContents={
            recommendationRequestFixtures.oneRecommendationRequest
          }
        />
      </Router>,
    );
    await screen.findByTestId(/RecommendationRequestForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-requesterEmail");
    const localDateTimeFieldA = screen.getByTestId(
      "RecommendationRequestForm-dateRequested",
    );
    const localDateTimeFieldB = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded",
    );
    const professorEmail = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const requesterEmail = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const explanation = screen.getByTestId(
      "RecommendationRequestForm-explanation",
    );

    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(localDateTimeFieldA, { target: { value: "bad-input" } });
    fireEvent.change(localDateTimeFieldB, { target: { value: "bad-input" } });
    fireEvent.change(professorEmail, { target: { value: "bad-input" } });
    fireEvent.change(requesterEmail, { target: { value: "bad-input" } });
    fireEvent.change(explanation, { target: { value: "" } });

    fireEvent.click(submitButton);

    await screen.findAllByText(/Local date time in ISO format required./);
    expect(screen.getByText(/requesterEmail is required./)).toBeInTheDocument();
    expect(screen.getByText(/professorEmail is required./)).toBeInTheDocument();
    expect(
      screen.getByText(
        /requesterEmail must be in the format <username>@<domain>.<com>/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /professorEmail must be in the format <username>@<domain>.<com>/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-submit");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/requesterEmail is required./);
    expect(screen.getByText(/requesterEmail is required./)).toBeInTheDocument();
    expect(screen.getByText(/professorEmail is required./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /requesterEmail must be in the format <username>@<domain>.<com>/,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /professorEmail must be in the format <username>@<domain>.<com>/,
      ),
    ).not.toBeInTheDocument();

    const errorMessages = screen.getAllByText(
      /Local date time in ISO format required./,
    );
    expect(errorMessages.length).toBe(2); // Check that there are exactly two error messages
    errorMessages.forEach((msg) => expect(msg).toBeInTheDocument());
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );

    await screen.findByTestId("RecommendationRequestForm-dateRequested");

    const localDateTimeFieldA = screen.getByTestId(
      "RecommendationRequestForm-dateRequested",
    );
    const localDateTimeFieldB = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded",
    );
    const professorEmail = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const requesterEmail = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const explanation = screen.getByTestId(
      "RecommendationRequestForm-explanation",
    );

    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(localDateTimeFieldA, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(localDateTimeFieldB, {
      target: { value: "2023-01-02T12:00" },
    });
    fireEvent.change(professorEmail, {
      target: { value: "aubreydrakegraham@ovo.com" },
    });
    fireEvent.change(requesterEmail, {
      target: { value: "jaydenjardine@cs.ucsb.edu" },
    });
    fireEvent.change(explanation, {
      target: { value: "I need a song with you and Ye ASAP." },
    });

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Local date time in ISO format required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/requesterEmail is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Professor's email is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Explanation is required/),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        /requesterEmail must be in the format <username>@<domain>.<com>/,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /professorEmail must be in the format <username>@<domain>.<com>/,
      ),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-cancel");
    const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  const setup = () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    const emailInput = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");
    return { emailInput, submitButton };
  };

  const validEmails = [
    "test@example.com",
    "test.subdomain@example.com",
    "test+alias@example.com",
    "test@example.co.uk",
  ];

  const invalidEmails = [
    "testexample.com",
    "test..doubleDot@example.com",
    "test@.startingDot@example.com",
    "test@example..doubleDot.com",
    "plainaddress",
    "@missingUsername.com",
    "test@.com.my",
    "test123@gmail.b",
    "test123@.com",
    "test123@.com.com",
    ".email@test.com",
    "email..email@test.com",
    "email@test.com (Joe Smith)",
    "email@test",
    "test@111.222.333.44444",
  ];

  // Testing valid emails
  validEmails.forEach((email) => {
    test(`should accept valid email: ${email}`, async () => {
      const { emailInput, submitButton } = setup();
      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(
          screen.queryByText(/requesterEmail is required./),
        ).not.toBeInTheDocument();
      });
      await waitFor(() => {
        expect(
          screen.queryByText(
            /requesterEmail must be in the format <username>@<domain>.<com>/,
          ),
        ).not.toBeInTheDocument();
      });
    });
  });

  // Testing invalid emails
  invalidEmails.forEach((email) => {
    test(`should reject invalid email: ${email}`, async () => {
      const { emailInput, submitButton } = setup();
      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(
          screen.getByText(/requesterEmail is required./),
        ).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(
          screen.getByText(
            /requesterEmail must be in the format <username>@<domain>.<com>/,
          ),
        ).toBeInTheDocument();
      });
    });
  });
});
