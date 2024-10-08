import React from "react";
import { 
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	View, 
	Pressable, 
	Text, 
	Image, 
	StyleSheet
 } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import SettingLine from "@/components/SettingLine";

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
				<SettingLine>
					<AntDesign name="profile" size={24} color="black" />
					<Text style={styles.cardItems}>Edit profile information</Text>
				</SettingLine>
				<SettingLine>
					<AntDesign name="bells" size={24} color="black" />
					<Text style={styles.cardItems}>Notifications</Text>
				</SettingLine>
				<SettingLine>
					<MaterialIcons name="language" size={24} color="black" />
					<Text style={styles.cardItems}>Language</Text>
				</SettingLine>
			</View>

			<View style={styles.card}>
				<SettingLine>
					<AntDesign name="lock" size={24} color="black" />
					<Text style={styles.cardItems}>Security</Text>
				</SettingLine>
				<SettingLine>
					<Ionicons name="moon-sharp" size={24} color="black" />
					<Text style={styles.cardItems}>Theme</Text>
				</SettingLine>
			</View>

			<View style={styles.card}>
				<SettingLine>
					<AntDesign name="contacts" size={24} color="black" />
					<Text style={styles.cardItems}>Help & Support</Text>
				</SettingLine>
				<SettingLine>
					<AntDesign name="message1" size={24} color="black" />
					<Text style={styles.cardItems}>Contact us</Text>
				</SettingLine>
				<SettingLine>
					<MaterialIcons name="shield" size={24} color="black" />
					<Text style={styles.cardItems}>Privacy policy</Text>
				</SettingLine>
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
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		width: '100%',
	},
	headerAction: {
		width: 40,
		height: 40,
		alignItems: "flex-start",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 19,
		fontWeight: '600',
		color: '#000',
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: 0,
		textAlign: 'center',
	},






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
		fontSize: 20,
		lineHeight: 26,
	},
});
