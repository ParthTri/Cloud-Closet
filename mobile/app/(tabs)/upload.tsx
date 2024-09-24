import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	FlatList,
	Button,
	ScrollView,
	StyleSheet,
	ActivityIndicator,
	Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import CheckBox from "react-native-check-box";
import { useAuth } from "../authContext";

const API_URL = "http://cloudcloset.kolide.co.nz/api/image";
//const USER_ID = '3FB87276-7269-EF11-BDFD-000D3AD087AD';
const CATEGORIES_API_URL = "http://cloudcloset.kolide.co.nz/api/categories";

interface Category {
	categoryID: number;
	name: string;
}

export default function Upload() {
	const { user } = useAuth(); // Access user data from AuthContext

	const [image, setImage] = useState<string | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

	const [uploading, setUploading] = useState(false);

	// Functions to get mimetype
	type ImageMimeType =
		| "image/jpeg"
		| "image/png"
		| "image/gif"
		| "image/webp"
		| "image/svg+xml"
		| "image/bmp";

	const mimeTypeToExtension: Record<ImageMimeType, string> = {
		"image/jpeg": "jpg",
		"image/png": "png",
		"image/gif": "gif",
		"image/webp": "webp",
		"image/svg+xml": "svg",
		"image/bmp": "bmp",
	};

	const getFileExtensionFromMimeType = (mimeType: string): string => {
		return mimeTypeToExtension[mimeType as ImageMimeType] || "unknown";
	};

	// Function to pick an image from library or camera
	const selectImage = async (useLibrary: boolean) => {
		let result;
		const options: ImagePicker.ImagePickerOptions = {
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			aspect: [4, 3],
			quality: 0.75,
		};

		if (useLibrary) {
			result = await ImagePicker.launchImageLibraryAsync(options);
		} else {
			await ImagePicker.requestCameraPermissionsAsync();
			result = await ImagePicker.launchCameraAsync(options);
		}

		if (!result.canceled && result.assets && result.assets.length > 0) {
			setImage(result.assets[0].uri);
		}
	};

	// Fetch categories from the API
	const fetchCategories = async () => {
		try {
			const response = await axios.get(CATEGORIES_API_URL);
			if (Array.isArray(response.data.data)) {
				setCategories(response.data.data);
			} else {
				console.error("Unexpected response format:", response.data);
			}
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	// Handle category selection
	const handleSelectCategory = (categoryID: number) => {
		setSelectedCategories((prevSelected) =>
			prevSelected.includes(categoryID)
				? prevSelected.filter((id) => id !== categoryID)
				: [...prevSelected, categoryID]
		);
	};

	// Function to submit image and categories
	// Upload image
	const uploadImage = async () => {
		if (!image || selectedCategories.length === 0) {
			alert("Please select an image and at least one category");
			return;
		}

		setUploading(true);
		console.log("URI:", image);

		let filename: string | undefined;
		let base64Image: string;

		try {
			if (image.startsWith("data:")) {
				const mimeType = image.split(";")[0].split(":")[1];
				filename = `image.${getFileExtensionFromMimeType(mimeType)}`;
				console.log(filename);
				base64Image = image;
			} else if (image.startsWith("file://")) {
				const cleanUri = image.replace(/^file:\/\//, "");
				filename = cleanUri.split("/").pop();
				const extension = filename?.split(".").pop();
				if (!filename) {
					throw new Error("Filename could not be determined from URI");
				}
				const mimeType =
					extension === "jpg" ? "image/jpeg" : `image/${extension}`;
				const base64 = await FileSystem.readAsStringAsync(cleanUri, {
					encoding: FileSystem.EncodingType.Base64,
				});
				base64Image = `data:${mimeType};base64,${base64}`;
			} else {
				throw new Error("Unsupported URI format");
			}

			const body = {
				image: base64Image,
				fileName: filename,
				categories: selectedCategories.join(","),
				userID: user?.userID,
			};

			const response = await axios.post(API_URL, body, {
				headers: { "Content-Type": "application/json" },
			});

			console.log("Upload response:", response.data);
			alert("Upload successful");
			setImage(null); // Clear selected image after upload
			setSelectedCategories([]); // Clear selected categories after upload
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.error("Axios error response:", error.response?.data);
				alert(
					`Upload failed: ${
						error.response?.data?.message || "Unknown Axios error"
					}`
				);
			} else if (error instanceof Error) {
				console.error("Error message:", error.message);
				alert(`Upload failed: ${error.message}`);
			} else {
				console.error("An unknown error occurred:", error);
				alert("Upload failed: An unknown error occurred");
			}
		} finally {
			setUploading(false);
		}
	};

	// Clear selected image and categories
	const clearAll = () => {
		setImage(null);
		setSelectedCategories([]);
	};

	// Fetch categories when component mounts
	React.useEffect(() => {
		fetchCategories();
	}, []);

	return (
		<ScrollView contentContainerStyle={{ padding: 20 }}>
			<View style={{ marginVertical: 20 }}>
				<Button title="Photo Library" onPress={() => selectImage(true)} />
				<Button title="Capture Image" onPress={() => selectImage(false)} />
			</View>
			{image && (
				<Image
					source={{ uri: image }}
					style={{ width: 200, height: 200, marginVertical: 20 }}
				/>
			)}

			<Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
				Please select at least 1 category
			</Text>
			<FlatList
				data={categories}
				keyExtractor={(item) => item.categoryID.toString()}
				renderItem={({ item }) => (
					<View style={styles.itemContainer}>
						<CheckBox
							style={styles.checkbox}
							isChecked={selectedCategories.includes(item.categoryID)}
							onClick={() => handleSelectCategory(item.categoryID)}
						/>
						<Text style={styles.itemText}>{item.name}</Text>
					</View>
				)}
			/>

			<Button
				title="Submit"
				onPress={uploadImage}
				disabled={uploading || !image}
			/>

			<Button title="Cancel" onPress={clearAll} color="red" />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	itemContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 8,
	},
	itemText: {
		marginLeft: 8,
		fontSize: 16,
	},
	checkbox: {
		marginRight: 10,
	},
});
