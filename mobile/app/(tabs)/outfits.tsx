import {
	View,
	Text,
	Pressable,
	StyleSheet,
	Modal,
} from "react-native";
import { useAuth } from "../authContext";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "@/components/Logo";
import React, { useState } from "react";

export default function Outfits() {
	const { user, logout } = useAuth(); 
	const [modalVisible, setModalVisible] = useState(false);

	const handleCloseModal = () => {
		setModalVisible(false);
	};

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Logo logoWidth={30} logoHeight={30} />
				<Text style={styles.header}>CLOUD CLOSET</Text>
				<Pressable onPress={() => setModalVisible(true)}>
					<Ionicons name="notifications-outline" size={30} color="black" />
				</Pressable>
			</View>

			{/* Modal for Notifications */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={handleCloseModal}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Notifications</Text>
						{/* Example Notification Box */}
						<View style={styles.notificationBox}>
							<Text style={styles.noNotificationsText}>No new notifications</Text>
						</View>
						<Pressable style={styles.closeButton} onPress={handleCloseModal}>
							<Text style={styles.closeButtonText}>Close</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
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
});
