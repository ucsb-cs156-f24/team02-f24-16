import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ArticlesForm tests", () => {
  const testId = "ArticlesForm";

  test("renders correctly with all fields", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );

    expect(await screen.findByText(/Title/)).toBeInTheDocument();
    expect(screen.getByText(/Url/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation/)).toBeInTheDocument();
    expect(screen.getByText(/Email/)).toBeInTheDocument();
    expect(screen.getByText(/Date Added/)).toBeInTheDocument();
    expect(screen.getByText(/Create/)).toBeInTheDocument(); // Default button label
  });

  test("renders correctly with initialContents", async () => {
    const initialContents = articlesFixtures.oneArticle;

    render(
      <Router>
        <ArticlesForm initialContents={initialContents} />
      </Router>
    );

    expect(screen.getByTestId(`${testId}-id`)).toHaveValue(String(initialContents.id));
    expect(screen.getByTestId(`${testId}-title`)).toHaveValue(initialContents.title);
    expect(screen.getByTestId(`${testId}-url`)).toHaveValue(initialContents.url);
    expect(screen.getByTestId(`${testId}-explanation`)).toHaveValue(initialContents.explanation);
    expect(screen.getByTestId(`${testId}-email`)).toHaveValue(initialContents.email);
    expect(screen.getByTestId(`${testId}-dateAdded`)).toHaveValue(initialContents.dateAdded.slice(0, 16));
  });

  test("shows validation errors on empty submission", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );

    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    expect(await screen.findByText(/Title is required/)).toBeInTheDocument();
    expect(screen.getByText(/Url is required/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Added is required/)).toBeInTheDocument();
  });

  test("submits successfully with valid input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <ArticlesForm submitAction={mockSubmitAction} />
      </Router>
    );

    const { title, url, explanation, email, dateAdded } = articlesFixtures.oneArticle;

    fireEvent.change(screen.getByTestId(`${testId}-title`), { target: { value: title } });
    fireEvent.change(screen.getByTestId(`${testId}-url`), { target: { value: url } });
    fireEvent.change(screen.getByTestId(`${testId}-explanation`), { target: { value: explanation } });
    fireEvent.change(screen.getByTestId(`${testId}-email`), { target: { value: email } });
    fireEvent.change(screen.getByTestId(`${testId}-dateAdded`), { target: { value: dateAdded.slice(0, 16) } });

    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
  });

  test("navigates back when cancel button is clicked", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );

    fireEvent.click(screen.getByTestId(`${testId}-cancel`));
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
