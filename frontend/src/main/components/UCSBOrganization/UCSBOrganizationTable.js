import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/ucsbOrganizationUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBOrganizationTable({
  organization,
  currentUser,
  testIdPrefix = "UCSBOrganizationTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/organizations/edit/${cell.row.values.orgCode}`);
  };

  // Stryker disable all : hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/organizations/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "OrgCode",
      accessor: "orgCode", // accessor is the "key" in the data
    },
    {
      Header: "OrgTranslationShort",
      accessor: "orgTranslationShort",
    },
    {
      Header: "OrgTranslation",
      accessor: "orgTranslation",
    },
    {
      Header: "Inactive",
      accessor: "inactive",
      Cell: ({ value }) => (value ? "✓" : "✕"),
    },
  ];

//   if (hasRole(currentUser, "ROLE_ADMIN")) {
//     columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
//     columns.push(
//       ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
//     );
//   }
if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    );
  }
  return <OurTable data={organization} columns={columns} testid={testIdPrefix} />;
}
