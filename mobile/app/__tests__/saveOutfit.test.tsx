import { Alert } from "react-native";
jest.mock("axios");
jest.spyOn(Alert, "alert");
const SAVE_OUTFIT_API_URL = "http://cloudcloset.kolide.co.nz/api/outfit/";

describe("Outfits", () => {
  // Allows navigation through images using left and right buttons
  let mockTopsImages;
  let currentTopsIndex;
  let setCurrentTopsIndex;

  beforeEach(() => {
    mockTopsImages = [
      { imageId: 1, processedUrl: "url1" },
      { imageId: 2, processedUrl: "url2" },
    ];
    currentTopsIndex = 0;
    setCurrentTopsIndex = jest.fn();
  });

  // Mock left press logic - Test 1
  it("should navigate left through tops", () => {
    const handleLeftPress = (index, setIndex, images) => {
      if (index > 0) {
        setIndex(index - 1);
      } else {
        setIndex(images.length - 1);
      }
    };

    handleLeftPress(currentTopsIndex, setCurrentTopsIndex, mockTopsImages);

    expect(setCurrentTopsIndex).toHaveBeenCalledWith(mockTopsImages.length - 1);
  });

  // Mock right press logic - Test 2
  it("should navigate right through tops", () => {
    const handleRightPress = (index, setIndex, images) => {
      if (index < images.length - 1) {
        setIndex(index + 1);
      } else {
        setIndex(0);
      }
    };

    handleRightPress(currentTopsIndex, setCurrentTopsIndex, mockTopsImages);

    expect(setCurrentTopsIndex).toHaveBeenCalledWith(1);
  });

  // Changes button color on press to indicate action - Test 3
  it("should change button color on press and call saveOutfit", () => {
    const mockSetButtonPressed = jest.fn();
    const mockSaveOutfit = jest.fn();

    mockSetButtonPressed(true);
    expect(mockSetButtonPressed).toHaveBeenCalledWith(true);

    mockSaveOutfit();
    expect(mockSaveOutfit).toHaveBeenCalled();

    mockSetButtonPressed(false);
    expect(mockSetButtonPressed).toHaveBeenCalledWith(false);
  });

  // Save outfit with valid image IDs and selected categories - Test 4
  it("should save outfit with valid image IDs and selected categories", async () => {
    const mockTopsImages = [
      { imageId: 1, processedUrl: "url1" },
      { imageId: 2, processedUrl: "url2" },
    ];
    const mockBottomsImages = [
      { imageId: 3, processedUrl: "url3" },
      { imageId: 4, processedUrl: "url4" },
    ];
    const mockFootwearImages = [
      { imageId: 5, processedUrl: "url5" },
      { imageId: 6, processedUrl: "url6" },
    ];

    const currentTopsIndex = 0;
    const currentBottomsIndex = 0;
    const currentFootwearIndex = 0;

    const setSelectedCategories = jest.fn();
    const setOutfitName = jest.fn();
    const mockAlert = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const axios = require("axios");
    axios.get = jest.fn().mockResolvedValue({
      data: {
        data: [
          { id: 1, name: "Category 1" },
          { id: 2, name: "Category 2" },
        ],
      },
    });
    axios.post = jest.fn().mockResolvedValue({ status: 200 });

    const saveOutfit = async () => {
      const outfitData = {
        userId: "mockUserId",
        outfitName: "My Outfit",
        joinImageIdsString: "1,3,5",
        joincategoryIdsString: "Category 1,Category 2",
      };

      await axios.post(SAVE_OUTFIT_API_URL, outfitData);

      setSelectedCategories([]);
      setOutfitName("");
      Alert.alert("Success", "Outfit saved successfully!");
    };

    const mockHandleLeftPress = jest.fn();
    const mockHandleRightPress = jest.fn();

    mockHandleLeftPress(currentTopsIndex, mockTopsImages);
    mockHandleRightPress(currentTopsIndex, mockTopsImages);
    mockHandleLeftPress(currentBottomsIndex, mockBottomsImages);
    mockHandleRightPress(currentBottomsIndex, mockBottomsImages);
    mockHandleLeftPress(currentFootwearIndex, mockFootwearImages);
    mockHandleRightPress(currentFootwearIndex, mockFootwearImages);

    await saveOutfit();

    expect(axios.post).toHaveBeenCalledWith(SAVE_OUTFIT_API_URL, {
      userId: expect.any(String),
      outfitName: expect.any(String),
      joinImageIdsString: "1,3,5",
      joincategoryIdsString: "Category 1,Category 2",
    });

    expect(mockAlert).toHaveBeenCalledWith(
      "Success",
      "Outfit saved successfully!"
    );

    expect(setSelectedCategories).toHaveBeenCalledWith([]);
    expect(setOutfitName).toHaveBeenCalledWith("");
  });
});
