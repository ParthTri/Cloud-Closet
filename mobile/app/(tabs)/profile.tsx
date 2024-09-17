import React from "react";
import { View, Pressable, Text, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Profile() {
	const router = useRouter();

	const goToHome = () => {
		router.push("../auth/signin");
	};

	return (
		<View style={styles.container}>
			{/* Overview */}
			<View style={styles.profileOverview}>
				<Image
					source={require("@/assets/images/profile.svg")}
					style={styles.profileImage}
				/>
				<Text style={{ fontSize: 18 }}>
					youremail@domain.com | +64 234 567 8
				</Text>
			</View>

			<View style={styles.card}>
				<Text style={styles.cardItems}>Edit profile information</Text>
				<Text style={styles.cardItems}>Notifications</Text>
				<Text style={styles.cardItems}>Language</Text>
			</View>

			<View style={styles.card}>
				<Text style={styles.cardItems}>Security</Text>
				<Text style={styles.cardItems}>Theme</Text>
			</View>

			<View style={styles.card}>
				<Text style={styles.cardItems}>Help & Support</Text>
				<Text style={styles.cardItems}>Contact us</Text>
				<Text style={styles.cardItems}>Privacy policy</Text>
			</View>

			<Pressable onPressIn={goToHome} style={styles.logout}>
				<Text
					style={{
						fontWeight: "bold",
						fontSize: 32,
					}}
				>
					LOGOUT
				</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	logout: {
		width: "90%",
		backgroundColor: "#DA7575",
		height: 80,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6,
		borderRadius: 10,
	},
	container: {
		display: "flex",
		alignItems: "center",
		backgroundColor: "#fff",
		height: "100%",
		justifyContent: "space-evenly",
	},
	profileImage: {
		maxWidth: 250,
		maxHeight: 250,
	},
	profileOverview: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		maxHeight: 300,
		fontSize: 24,
	},
	card: {
		borderRadius: 10,
		width: "90%",
		height: "auto",
		padding: 10,
		display: "flex",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6,
	},
	cardItems: {
		fontSize: 18,
		lineHeight: 26,
	},
});
