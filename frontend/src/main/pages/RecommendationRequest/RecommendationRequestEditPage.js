import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: request,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/recommendationRequest?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/recommendationRequest`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (request) => ({
    url: "/api/recommendationRequest",
    method: "PUT",
    params: {
      id: request.id,
    },
    data: {
      requesterEmail: request.requesterEmail,
      professorEmail: request.professorEmail,
      explanation: request.explanation,
      done: request.done,
      dateRequested: request.dateRequested,
      dateNeeded: request.dateNeeded,
    },
  });

  const onSuccess = (request) => {
    toast(
      `RecommendationRequest Updated - id: ${request.id} requestor: ${request.requesterEmail} professor: ${request.professorEmail} explanation: ${request.explanation} status: ${request.done} date requested: ${request.dateRequested} date needed by ${request.dateNeeded}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/recommendationRequest?id=${id}`],
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
        <h1>Edit recommendationRequest</h1>
        {request && (
          <RecommendationRequestForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={request}
          />
        )}
      </div>
    </BasicLayout>
  );
}
