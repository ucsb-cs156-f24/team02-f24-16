import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({ storybook = false }) {
  let { orgCode } = useParams();

  const {
    data: organization,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/organizations?orgCode=${orgCode}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/organizations`,
      params: {
        orgCode,
      },
    },
  );

  const objectToAxiosPutParams = (organization) => ({
    url: "/api/organizations",
    method: "PUT",
    params: {
        orgCode: organization.orgCode,
    },
    data: {
      name: organization.name,
      description: organization.description,
    },
  });

  const onSuccess = (organization) => {
    toast(`Organization Updated - orgCode: ${organization.orgCode} name: ${organization.name}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/organizations?orgCode=${orgCode}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/organizations" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Organization</h1>
        {organization && (
          <UCSBOrganizationForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={organization}
          />
        )}
      </div>
    </BasicLayout>
  );
}
