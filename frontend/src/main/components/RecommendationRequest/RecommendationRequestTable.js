import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/recommendationRequestUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function RecommendationRequestTable({
  requests,
  currentUser,
  testIdPrefix = "RecommendationRequestTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/recommendationRequest/edit/${cell.row.values.id}`);
  };

  // Stryker disable all : hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/recommendationRequest/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };
  // @Parameter(name="requesterEmail") @RequestParam String requesterEmail,
  // @Parameter(name="professorEmail") @RequestParam String professorEmail,
  // @Parameter(name="explanation") @RequestParam String explanation,
  // @Parameter(name="done") @RequestParam Boolean done,
  // @Parameter(name="dateRequested", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("dateRequested") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateRequested,
  // @Parameter(name="dateNeeded", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("dateNeeded") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateNeeded

  const columns = [
    {
      Header: "id",
      accessor: "id", // accessor is the "key" in the data
    },
    {
      Header: "Requester Email",
      accessor: "requesterEmail",
    },
    {
      Header: "Professor Email",
      accessor: "professorEmail",
    },
    {
      Header: "Explanation",
      accessor: "explanation",
    },
    {
      Header: "Finished",
      accessor: "done",
      // Adding a custom cell renderer
      Cell: ({ value }) => (value ? "✓" : "✕"), // Use Unicode symbols for checkmark and cross
    },
    {
      Header: "Date Requested",
      accessor: "dateRequested",
    },
    {
      Header: "Date Needed By",
      accessor: "dateNeeded",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(
      ButtonColumn(
        "Edit",
        "primary",
        editCallback,
        "recommendationRequestTable",
      ),
    );
    columns.push(
      ButtonColumn(
        "Delete",
        "danger",
        deleteCallback,
        "recommendationRequestTable",
      ),
    );
  }

  return <OurTable data={requests} columns={columns} testid={testIdPrefix} />;
}
