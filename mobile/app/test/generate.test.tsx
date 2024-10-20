import axios from "axios";
import { GenerateService } from "./GenerateService"; // Ensure the path is correct

jest.mock("axios");

describe("fetchGenerate", () => {
  it("should return generated images when valid parameters are provided", async () => {
    const mockResponse = {
      data: {
        data: [
          {
            processedUrl: "http://example.com/image1.jpg",
            imageCategory: [{ categoryName: "Casual" }],
          },
          {
            processedUrl: "http://example.com/image2.jpg",
            imageCategory: [{ categoryName: "Formal" }],
          },
        ],
      },
    };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const service = new GenerateService();
    const result = await service.fetchGenerate(
      "user123",
      174.7633,
      -36.8485,
      1
    );

    expect(result).toEqual([
      { imageUrl: "http://example.com/image1.jpg", categories: "Casual" },
      { imageUrl: "http://example.com/image2.jpg", categories: "Formal" },
    ]);
  });

  it("should log an error and return an empty array when userId is missing", async () => {
    console.error = jest.fn();

    const service = new GenerateService();
    const result = await service.fetchGenerate(
      undefined,
      174.7633,
      -36.8485,
      1
    );

    expect(console.error).toHaveBeenCalledWith("User ID is not provided.");
    expect(result).toEqual([]);
  });

  it("should use selectedCategories when available", async () => {
    const mockSelectedCategories = ["Casual", "Formal"];

    const mockResponse = {
      data: {
        data: [
          {
            processedUrl: "image1.jpg",
            imageCategory: [{ categoryName: "category1" }],
          },
          {
            processedUrl: "image2.jpg",
            imageCategory: [{ categoryName: "category2" }],
          },
        ],
      },
    };

    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const service = new GenerateService();
    service.setSelectedCategories(mockSelectedCategories); // Use the setter

    const result = await service.fetchGenerate("123", 1.23, 4.56, 1);

    expect(result).toEqual([
      { imageUrl: "image1.jpg", categories: "category1" },
      { imageUrl: "image2.jpg", categories: "category2" },
    ]);
  });

  it("should return image objects when API response is valid", async () => {
    const mockResponse = {
      data: {
        data: [
          {
            processedUrl: "image1.jpg",
            imageCategory: [{ categoryName: "category1" }],
          },
          {
            processedUrl: "image2.jpg",
            imageCategory: [{ categoryName: "category2" }],
          },
        ],
      },
    };

    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const service = new GenerateService();
    const result = await service.fetchGenerate("123", 1.23, 4.56, 1);

    expect(result).toEqual([
      { imageUrl: "image1.jpg", categories: "category1" },
      { imageUrl: "image2.jpg", categories: "category2" },
    ]);
  });
});
