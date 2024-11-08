import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/ucsbOrganizationUtils";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("UCSBOrganizationUtils", () => {
  describe("onDeleteSuccess", () => {
    test("It puts the message on console.log and in a toast", () => {
      // arrange
      const restoreConsole = mockConsole();

      // act
      onDeleteSuccess("Organization deleted successfully");

      // assert
      expect(mockToast).toHaveBeenCalledWith(
        "Organization deleted successfully",
      );
      expect(console.log).toHaveBeenCalled();
      const message = console.log.mock.calls[0][0];
      expect(message).toMatch("Organization deleted successfully");

      restoreConsole();
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    test("It returns the correct params", () => {
      // arrange
      const cell = { row: { values: { orgCode: "SKY" } } };

      // act
      const result = cellToAxiosParamsDelete(cell);

      // assert
      expect(result).toEqual({
        url: "/api/ucsborganization",
        method: "DELETE",
        params: { orgCode: "SKY" },
      });
    });
  });
});
