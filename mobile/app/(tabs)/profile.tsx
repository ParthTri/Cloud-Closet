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

