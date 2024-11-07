// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

// export default function UCSBOrganizationIndexPage() {
//   // Stryker disable all : placeholder for future implementation
//   return (
//     <BasicLayout>
//       <div className="pt-2">
//         <h1>Index page not yet implemented</h1>
//         <p>
//           <a href="/organizations/create">Create</a>
//         </p>
//         <p>
//           <a href="/organizations/edit/1">Edit</a>
//         </p>
//       </div>
//     </BasicLayout>
//   );
// }

import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { Button } from "react-bootstrap";

export default function UCSBOrganizationIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: organization,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/ucsborganization/all"],
    { method: "GET", url: "/api/ucsborganization/all" },
    // Stryker disable next-line all : don't test default value of empty list
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/ucsborganization/create"
          style={{ float: "right" }}
        >
          Create UCSBOrganization
        </Button>
      );
    }
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>UCSB Organizations</h1>
        <UCSBOrganizationTable
          organization={organization}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
