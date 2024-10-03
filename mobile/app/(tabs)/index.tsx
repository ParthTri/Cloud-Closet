import { View, Text, Pressable, StyleSheet, Image, ScrollView, Modal } from "react-native";
import { useAuth } from "../authContext";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Logo } from "@/components/Logo";
import React, { useState } from 'react';

export default function HomePage() {
	const { user, logout } = useAuth(); // Get user data from AuthContext
	const [modalVisible, setModalVisible] = useState(false);
	const [buttonPressed, setButtonPressed] = useState(false);
	// const fetchWeatherData = async () => { ... }

	// test - need to replace??? with actual notifs
	const notifications = [
		{ id: 1, message: 'New outfit suggestion available!' },
		{ id: 2, message: 'Your outfit has been saved successfully.' },
		{ id: 3, message: 'Weather update: Chance of rain today.' },
	];

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
							<Text style={styles.noNotificationsText}>No new notifications</Text>
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

			<View style={styles.weatherContainer}>
				<View style={styles.weatherInfo}>
					<FontAwesome name1="cloud-rain" size={24} color="black" />
					<View style={styles.weatherTextContainer}>
						<Text style={styles.weatherDate}>Thu Oct 26</Text> 
						{/* change to make this todays date */}
						<Text style={styles.weatherTemp}>23°C</Text>
						{/* change to weather*/}
					</View>
				</View>
			</View>

			{/* Generate Outfit Button */}
			<Pressable
				style={[
					styles.generateButton,
					{ backgroundColor: buttonPressed ? "#F9F9F9" : "#8ABAE3" } // Change color based on state
				]}
				onPressIn={() => setButtonPressed(true)} // When button is pressed
				onPressOut={() => setButtonPressed(false)} // When button is released
			>
				<Text style={styles.generateButtonText}>GENERATE OUTFIT</Text>
			</Pressable>

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
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "#FFF",
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 15,
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
		paddingHorizontal: 20,
		borderRadius: 5,
	},
	closeButtonText: {
		color: "#FFF",
		fontWeight: "bold",
	},
	weatherContainer: {
		backgroundColor: "#F1F1F1",
		borderRadius: 15,
		padding: 20,
		marginTop: 20,
		alignItems: "center",
		borderWidth: 2,
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
	weatherTemp: {
		fontSize: 32,
		fontWeight: "bold",
	},
	generateButton: {
		backgroundColor: "#8ABAE3",
		borderRadius: 15,
		paddingVertical: 10,
		paddingHorizontal: 30,
		marginTop: 20,
		alignItems: "center",
		borderWidth: 2,
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
	},
	outfitItem: {
		width: "48%",
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 10,
		marginBottom: 10,
		alignItems: "center",
		borderWidth: 2,
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
});
