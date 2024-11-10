import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/currentUser";

export default function MenuItemReviewIndexPage() {
  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/MENU_ITEM_REVIEW/create"
          style={{ float: "right" }}
        >
          Create MenuItemReview
        </Button>
      );
    }
  };

  const {
    data: dates,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/MENU_ITEM_REVIEW/all"],
    { method: "GET", url: "/api/MENU_ITEM_REVIEW/all" },
    [],
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>MenuItemReview</h1>
        <MenuItemReviewTable dates={dates} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}