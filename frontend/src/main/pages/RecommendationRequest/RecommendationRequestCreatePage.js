import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({ storybook = false }) {
  const objectToAxiosParams = (request) => ({
    url: "/api/recommendationRequest/post",
    method: "POST",
    params: {
      requesterEmail: request.requesterEmail,
      professorEmail: request.professorEmail,
      explanation: request.explanation,
      done: request.done,
      dateRequested: request.dateRequested,
      dateNeeded: request.dateNeeded,
    },
  });
  // @Parameter(name="requesterEmail") @RequestParam String requesterEmail,
  // @Parameter(name="professorEmail") @RequestParam String professorEmail,
  // @Parameter(name="explanation") @RequestParam String explanation,
  // @Parameter(name="done") @RequestParam Boolean done,
  // @Parameter(name="dateRequested", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("dateRequested") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateRequested,
  // @Parameter(name="dateNeeded", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("dateNeeded") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateNeeded

  const onSuccess = (request) => {
    toast(
      `New RecommendationRequest Created - id: ${request.id} requestor: ${request.requesterEmail} professor: ${request.professorEmail} explanation: ${request.explanation} status: ${request.done} date requested: ${request.dateRequested} date needed by ${request.dateNeeded}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/recommendationRequest/all"], // mutation makes this key stale so that pages relying on it reload
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationRequest" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New recommendationRequest</h1>
        <RecommendationRequestForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
