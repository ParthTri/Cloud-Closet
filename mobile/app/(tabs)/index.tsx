import {
	View,
	Text,
	Pressable,
	StyleSheet,
	Image,
	ScrollView,
	Modal,
	Alert,
	Button,
	FlatList,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from "react-native";
import { useAuth } from "../authContext";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { Logo } from "@/components/Logo";
import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { getUser } from "../lib/auth";

export default function HomePage() {
	const user = getUser(); // Get use from auth.ts
	const [userId, setUser] = useState<any>(null);

	const latitude = -36.848461;
	const longitude = 174.763336;
	const [modalVisible, setModalVisible] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [buttonPressed, setButtonPressed] = useState(false);
	const [loading, setLoading] = useState(true);

	const [isCategorySelectionVisible, setIsCategorySelectionVisible] =
		useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
	const [uploading, setUploading] = useState(false);
	const [generatedImage, setGeneratedImage] = useState<string | null>(null);

	//weather API
	const API_Weather = "https://cloudcloset.kolide.co.nz/api/weather";
	//outfit category API
	const OUTFIT_CATEGORIES_API_URL =
		"http://cloudcloset.kolide.co.nz/api/outfitCategory/all";
	//generate outfit API
	const API_Generate = "https://cloudcloset.kolide.co.nz/api/genOutfit";

	const [weatherData, setWeatherData] = useState({
		weather: "Loading...",
		temperature: null,
		location: "",
	});

	interface Category {
		id: number;
		name: string;
	}

	const fetchWeatherData = async (latitude: number, longitude: number) => {
		setLoading(true);
		try {
			const response = await axios.post(API_Weather, {
				latitude,
				longitude,
			});
			console.log("Weather data response:", response.data);
			const { data, error } = response.data;

			if (error) {
				throw new Error(error);
			}

			setWeatherData({
				weather: data.weather,
				temperature: data.temperature,
				location: data.location,
			});
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.error(
					"Axios error:",
					error.response ? error.response.data : error.message
				);
			} else if (error instanceof Error) {
				console.error("Error:", error.message);
			} else {
				console.error("An unknown error occurred");
			}
			setWeatherData({
				weather: "Unavailable",
				temperature: null,
				location: "",
			});
		} finally {
			setLoading(false);
		}
	};

	// updated uploadImage, selectedCategory,
	// saveImageWithCategories, fetchOutfitCategories & useEffect
	const uploadImage = async () => {
		if (!selectedImage || selectedCategories.length === 0) {
			Alert.alert("Error", "Please select at least one category");
			return;
		}
		setUploading(true);
	};

	const selectedCategory = (categoryID: number) => {
		if (selectedCategories.includes(categoryID)) {
			setSelectedCategories(
				selectedCategories.filter((id) => id !== categoryID)
			);
		} else {
			setSelectedCategories([...selectedCategories, categoryID]);
		}
	};

	const saveImageWithCategories = async () => {
		await uploadImage();
		setSelectedCategories([]);
		setIsModalVisible(false);
	};

	const fetchOutfitCategories = async () => {
		try {
			const response = await axios.get(OUTFIT_CATEGORIES_API_URL);
			const response: AxiosResponse<{
				data: Category[];
				error: string | null;
			}> = await axios.get(OUTFIT_CATEGORIES_API_URL);
			if (Array.isArray(response.data.data)) {
				console.log(response.data.data);
				setCategories(response.data.data);
			} else {
				console.error("Unexpected response format:", response.data);
			}
		} catch (error) {
			console.error("Error fetching outfit categories:", error);
		}
	};

	interface WeatherProps {
		weather: string;
		temperature: number | null;
	}

	const Weather: React.FC<WeatherProps> = ({ weather, temperature }) => {
		const weatherImages: { [key: string]: any } = {
			Clear: require("../../assets/weather/sun.png"),
			Clouds: require("../../assets/weather/cloudy.png"),
			Rain: require("../../assets/weather/rainy-1.png"),
			Thunderstorm: require("../../assets/weather/storm-1.png"),
			Drizzle: require("../../assets/weather/rainy.png"),
			Atmosphere: require("../../assets/weather/foog.png"),
		};

		const weatherImage =
			weatherImages[weather] || require("../../assets/weather/night.png"); // Default image - need to find one

		return (
			<View style={styles.weatherContainer}>
				<View style={styles.weatherInfo}>
					<Image source={weatherImage} style={styles.weatherImage} />
					<View style={styles.weatherTextContainer}>
						<Text style={styles.weatherDate}>Today</Text>
						<Text style={styles.weatherTemp}>
							{weatherData.temperature !== null
								? `${weatherData.temperature}°C`
								: "N/A"}
						</Text>
						<Text style={styles.weatherLocation}>
							{weatherData.location || "Unknown Location"}
						</Text>
					</View>
				</View>
			</View>
		);
	};
	const fetchGenerate = async (
		userId: string | undefined,
		longitude: number,
		latitude: number,
		type: number
	) => {
		try {
			if (!userId) {
				console.error("User ID is not provided.");
				return;
			}

			const selectedType = Math.floor(Math.random() * 2);
			console.log(selectedType);

			console.log("Sending request to generate outfit with data:", {
				userId: userId,
				longitude,
				latitude,
				type: selectedType,
			});

			const response = await axios.post(API_Generate, {
				userId: userId,
				longitude,
				latitude,
				type: selectedType,
			});

			console.log("API response:", response.data);

			if (response.data && response.data.data.length > 0) {
				const generatedImages = response.data.data.map(
					(item: { processedUrl: any; imageCategory: any[] }) => ({
						imageUrl: item.processedUrl,
						categories: item.imageCategory
							.map((cat) => cat.categoryName)
							.join(", "),
					})
				);

				// Return array of generated images with their categories
				return generatedImages;
			} else {
				console.error("No images returned from the API.");
				return [];
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("Axios error:", error.response?.data || error.message);
			} else {
				console.error("Error:", error);
			}
		}
	};

	useEffect(() => {
		// Get user info using getUser
		const currentUser = getUser();
		setUser(currentUser); // Set the user state

		fetchOutfitCategories();
		fetchWeatherData(latitude, longitude);
		console.log("Current user:", currentUser);
	}, []);

	// this is a placeholder for notifications if we want to continue developing
	const notifications = [
		{ id: 1, message: "New outfit suggestion available!" },
		{ id: 2, message: "Your outfit has been saved successfully." },
		{ id: 3, message: "Weather update: Chance of rain today." },
	];

	//styling
	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Logo logoWidth={30} logoHeight={30} />
				<Text style={styles.header}>CLOUD CLOSET</Text>
				<Pressable onPress={() => setModalVisible(true)}>
					<Ionicons name="notifications-outline" size={30} color="black" />
				</Pressable>
			</View>

			{/* this is the notifications */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Notifications</Text>
						{notifications.length > 0 ? (
							notifications.map((notification) => (
								<Text key={notification.id} style={styles.notificationBox}>
									{notification.message}
								</Text>
							))
						) : (
							<Text style={styles.noNotificationsText}>
								No new notifications
							</Text>
						)}
						<Pressable
							style={styles.closeButton}
							onPress={() => setModalVisible(false)}
						>
							<Text style={styles.closeButtonText}>Close</Text>
						</Pressable>
					</View>
				</View>
			</Modal>

			{/* Weather Info - added most of the design to the return statement*/}
			{loading ? (
				<Text>Loading weather data...</Text>
			) : (
				<Weather
					weather={weatherData.weather}
					temperature={weatherData.temperature}
				/>
			)}

			{/* Generate Outfit Button */}
			<Pressable
				style={[
					styles.generateButton,
					{ backgroundColor: buttonPressed ? "#F9F9F9" : "#8ABAE3" },
				]}
				onPressIn={() => setButtonPressed(true)}
				onPressOut={() => setButtonPressed(false)}
				onPress={async () => {
					try {
						// Retrieve user data using useAuth

						if (userId) {
							// Ensure user is authenticated
							latitude;
							longitude;
							const type =
								selectedCategories.length > 0 ? selectedCategories[0] : 0;

							// Call fetchGenerate with userId, longitude, latitude, and type
							const generatedOutfit = await fetchGenerate(
								user?.userId, // Pass the userId from useAuth
								longitude,
								latitude,
								type
							);

							if (generatedOutfit && generatedOutfit.length > 0) {
								setGeneratedImage(generatedOutfit); // Set image URL if successful
								setIsModalVisible(true); // Open the modal to display the generated outfit
							} else {
								console.error("No outfit image generated.");
							}
						} else {
							console.warn("User: ", userId);
							console.warn("User is not authenticated.");
						}
					} catch (error) {
						console.error("Error generating outfit:", error);
					}
				}}
			>
				<Text style={styles.generateButtonText}>GENERATE OUTFIT</Text>
			</Pressable>

			{/* Generated outfit images */}
			<Modal
				visible={isModalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setIsModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<ScrollView contentContainerStyle={styles.scrollView}>
							{!isCategorySelectionVisible ? (
								<>
									<Text style={styles.modalTitle}>Generated Outfit:</Text>
									<TouchableOpacity
										onPress={() => setIsModalVisible(false)}
										style={styles.closeIconContainer} // Add a style for positioning
									>
										<AntDesign name="closecircleo" size={30} color="black" />
									</TouchableOpacity>

									{Array.isArray(generatedImage) &&
									generatedImage.length > 0 ? (
										generatedImage.map((item, index) => (
											<View key={index} style={styles.generatedImageContainer}>
												<Image
													source={{ uri: item.imageUrl }}
													style={styles.generatedImage}
													resizeMode="contain"
												/>
											</View>
										))
									) : (
										<Text style={styles.modalText}>No outfit generated</Text>
									)}
									<Text style={styles.modalText}>
										Would you like to save this outfit?
									</Text>
									<View style={styles.modalButtonContainer}>
										<TouchableOpacity
											style={styles.modalButton}
											onPress={() => setIsCategorySelectionVisible(true)}
										>
											<Text style={styles.modalButtonText}>Yes</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={styles.modalButton}
											onPress={() => setIsModalVisible(false)}
										>
											<Text style={styles.modalButtonText}>No</Text>
										</TouchableOpacity>
									</View>
								</>
							) : (
								<>
									<Text style={styles.modalText}>Select categories:</Text>
									<ScrollView
										style={styles.categoriesContainer}
										horizontal={true}
									>
										{categories.map((category) => (
											<Pressable
												key={category.categoryID}
												onPress={() => selectedCategory(category.categoryID)}
												style={[
													styles.categoryButton,
													selectedCategories.includes(category.categoryID) &&
														styles.selectedCategory,
												]}
											>
												<Text style={styles.categoryText}>{category.name}</Text>
											</Pressable>
										))}
									</ScrollView>
									<View style={styles.modalButtonContainer}>
										<Button title="Save" onPress={saveImageWithCategories} />
										<Button
											title="Cancel"
											onPress={() => {
												setIsModalVisible(false);
											}}
										/>
									</View>
								</>
							)}
						</ScrollView>
					</View>
				</View>
			</Modal>

			<Text style={styles.sectionHeader}>Saved Outfits</Text>

			<ScrollView>
				<View style={styles.outfitGrid}>
					{[...Array(6)].map((_, index) => (
						<View key={index} style={styles.outfitItem}>
							{/*  replace this with saved outfits image */}
							<Image
								source={{ uri: "https://via.placeholder.com/100" }}
								style={styles.outfitImage}
							/>
							<Text style={styles.outfitText}>Outfit {index + 1}</Text>
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#FFFFFF",
		paddingTop: 55,
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
	},
	weatherContainer: {
		backgroundColor: "#F1F1F1",
		borderRadius: 15,
		padding: 20,
		marginTop: 20,
		alignItems: "stretch",
		borderWidth: 1,
		flexDirection: "row",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2,
	},
	weatherInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	weatherTextContainer: {
		marginLeft: 10,
	},
	weatherDate: {
		fontSize: 16,
		color: "gray",
	},
	weatherLocation: {
		fontSize: 18,
		color: "#333333",
		fontWeight: "bold",
		marginTop: 5,
	},
	weatherImage: {
		width: 85,
		height: 85,
		marginRight: 15,
	},
	weatherTemp: {
		fontSize: 36,
		fontWeight: "bold",
	},
	weatherCondition: {
		fontSize: 24,
		fontWeight: "bold",
	},
	generateButton: {
		backgroundColor: "#8ABAE3",
		borderRadius: 15,
		paddingVertical: 10,
		paddingHorizontal: 30,
		marginTop: 20,
		alignItems: "center",
		borderWidth: 1,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2,
	},
	generatedImageContainer: {
		// flex: 1,
		// margin: 5,
		// alignItems: "center",
		// maxWidth: "48%",
		// borderRadius: 10,
		// overflow: "hidden",
		// justifyContent: "center",
		// marginBottom: 15,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 15,
	},
	generateButtonText: {
		fontSize: 18,
		fontWeight: "bold",
	},
	sectionHeader: {
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 20,
	},
	outfitGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginTop: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2,
	},
	scrollView: {
		flexGrow: 1,
	},
	outfitItem: {
		width: "48%",
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 10,
		marginBottom: 10,
		alignItems: "center",
		borderWidth: 1,
	},
	outfitImage: {
		width: 100,
		height: 100,
		borderRadius: 8,
	},
	outfitText: {
		marginTop: 10,
		fontSize: 16,
		fontWeight: "500",
	},
	//modal stuff
	row: {
		flex: 1,
		justifyContent: "space-evenly", // Space out the items in each row
		marginBottom: 10,
	},
	notificationBox: {
		backgroundColor: "#F9F9F9",
		borderRadius: 8,
		padding: 15,
		marginVertical: 5,
		width: "100%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	noNotificationsText: {
		fontSize: 16,
		color: "gray",
	},
	closeButton: {
		marginTop: 20,
		backgroundColor: "#8ABAE3",
		paddingVertical: 10,
		paddingHorizontal: 10,
		borderRadius: 5,
	},
	closeButtonText: {
		color: "#FFF",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalButtonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
	modalContent: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		width: "90%",
		maxHeight: "80%",
		position: "relative",
	},
	modalTitle: {
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	modalText: {
		fontSize: 18,
		fontWeight: "bold",
		alignContent: "center",
		textAlign: "center",
		marginTop: 30,
	},
	modalButton: {
		backgroundColor: "#8ABAE3",
		paddingVertical: 5,
		flex: 1,
		marginHorizontal: 5,
		borderRadius: 8,
	},
	modalButtonText: {
		color: "#FFF",
		fontWeight: "bold",
		fontSize: 16,
		textAlign: "center",
	},
	categoriesContainer: {
		maxHeight: 60,
		flexDirection: "row",
	},
	categoryButton: {
		backgroundColor: "#eee",
		paddingVertical: 10,
		paddingHorizontal: 20,
		margin: 5,
		borderRadius: 10,
		maxHeight: 40,
	},
	selectedCategory: {
		backgroundColor: "#007AFF",
	},
	categoryText: {
		color: "#000",
		fontSize: 16,
	},
	generatedImage: {
		width: 250,
		height: 250,
	},
	closeIconContainer: {
		position: "absolute",
		top: 10,
		right: 10,
		zIndex: 1,
	},
});
