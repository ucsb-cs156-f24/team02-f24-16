import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { Button } from "react-bootstrap";

export default function RecommendationRequestIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: request,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/recommendationRequest/all"],
    { method: "GET", url: "/api/recommendationRequest/all" },
    // Stryker disable next-line all : don't test default value of empty list
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/recommendationRequest/create"
          style={{ float: "right" }}
        >
          Create recommendationRequest
        </Button>
      );
    }
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>recommendationRequest</h1>
        <RecommendationRequestTable
          request={request}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
