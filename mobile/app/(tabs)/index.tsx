import { View, Text, Pressable, StyleSheet, Image, ScrollView } from "react-native";
import { useAuth } from "../authContext";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Logo } from "@/components/Logo";


export default function HomePage() {
	const { user, logout } = useAuth(); // Get user data from AuthContext
	

	return (
		
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Logo logoWidth={30} logoHeight={30} />
				<Text style={styles.header}>CLOUD CLOSET</Text>
				<Ionicons name="notifications-outline" size={30} color="black" />
			</View>
			
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

			{/* Generate Outfit Button - change to click change color */}
			<Pressable style={styles.generateButton}>
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
