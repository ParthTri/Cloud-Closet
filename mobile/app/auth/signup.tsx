import { View, Text, StyleSheet, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";

export default function Signup() {
	return (
		<View style={{ flex: 1, justifyContent: "center", maxHeight: "20%" }}>
			<Link href="/" style={styles.back} asChild>
				<AntDesign name="leftcircleo" size={30} color="black" />
			</Link>
			<View style={styles.header}>
				<Text style={{ fontSize: 24 }}>Sign Up</Text>
				<Text style={{ fontSize: 48 }}>Welcome</Text>
				<Text style={{ fontSize: 18 }}>Please create your account here</Text>
			</View>
			<View></View>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		alignItems: "center",
	},
	back: {
		top: 10,
		left: 10,
		width: "auto",
	},
	header: {
		flex: 1,
		justifyContent: "space-evenly",
		alignItems: "center",
	},
});
