import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuth } from "../authContext";

export default function HomePage() {
	const { user, logout } = useAuth();// Get user data from AuthContext
	return (
		<View>
			<View
				style={{
					alignItems: "center",
        }} 
			>
				<Text style={styles.header}>Cloud Closet</Text>
				{/* Weather component */}
				<View>
					<Text>Its a sunny day</Text>
				</View>
				{/* Recommended Outfit */}
				<View>
					<Text>Recommended Outfit</Text>
				</View>

				{/* Display User Information */}
				{user ? (
          			<Text>Welcome, {user.userName}</Text> // Assuming user object has a name property
        		) : (
          			<Text>Please sign in</Text>
        		)}

				<Pressable>
					<Text>GENERATE OUTFIT</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		fontSize: 32,
		fontWeight: "bold",
	},
});
