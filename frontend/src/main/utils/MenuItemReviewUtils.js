import { toast } from "react-toastify";

// Stryker disable all : dev facing debug function, no need to test

export function onDeleteSuccess(message) {
  console.log(message);
  toast(message);
}

// Stryker restore all

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/menu_item_review",
    method: "DELETE",
    params: {
      id: cell.row.values.id,
    },
  };
}
