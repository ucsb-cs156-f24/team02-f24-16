import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { Button } from "react-bootstrap";

export default function UCSBOrganizationIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: organizations, //??? change??
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/organizations/all"],
    { method: "GET", url: "/api/organizations/all" },
    // Stryker disable next-line all : don't test default value of empty list
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/organizations/create" // ???
          style={{ float: "right" }}
        >
          Create Organization
        </Button>
      );
    }
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>Organizations</h1>
        <UCSBOrganizationTable organizations={organizations} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}
