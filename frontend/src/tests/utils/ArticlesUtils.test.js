// Import necessary modules and functions
import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/ArticlesUtils";
import { toast } from "react-toastify";

// Mock `react-toastify` to avoid actual toast calls during tests
jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("ArticlesUtils", () => {
  describe("onDeleteSuccess", () => {
    it("should log the message and call toast with the message", () => {
      // Arrange
      const message = "Article deleted successfully";
      console.log = jest.fn(); // Mock console.log

      // Act
      onDeleteSuccess(message);

      // Assert
      expect(console.log).toHaveBeenCalledWith(message);
      expect(toast).toHaveBeenCalledWith(message);
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    it("should return the correct axios params object for a cell", () => {
      // Arrange
      const mockCell = {
        row: {
          values: {
            id: 123,
          },
        },
      };

      // Act
      const result = cellToAxiosParamsDelete(mockCell);

      // Assert
      expect(result).toEqual({
        url: "/api/articles",
        method: "DELETE",
        params: {
          id: 123,
        },
      });
    });
  });
});
