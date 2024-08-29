import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Home() {
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
