import { View, Text, StyleSheet } from "react-native";
import { Logo } from "@/components/Logo";
import { Link } from "expo-router";

export default function HomeScreen() {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				height: "80%",
				paddingTop: "20%",
				justifyContent: "space-between",
			}}
		>
			<Logo logoWidth={300} logoHeight={300}></Logo>
			<View style={styles.container}>
				<Link href="/auth/signup" style={styles.link}>
					<Text style={styles.text}>Sign Up</Text>
				</Link>
				<Link
					href="/auth/signin"
					style={{
						...styles.link,
						backgroundColor: "#fff",
						borderColor: styles.link.backgroundColor,
						borderWidth: 3,
					}}
				>
					<Text
						style={{
							...styles.text,
							color: styles.link.backgroundColor,
							lineHeight: 30,
						}}
					>
						Sign In
					</Text>
				</Link>
				<Link href={"/(tabs)"}>Home Page</Link>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-evenly", // Centers vertically
		alignItems: "center", // Centers horizontally
	},
	link: {
		padding: 10,
		width: 245,
		textAlign: "center",
		height: 55,
		backgroundColor: "#8ABAE3",
		borderRadius: 25,
		overflow: "hidden",
		justifyContent: "center", // Centers content vertically
		alignItems: "center",
	},
	text: {
		color: "#fff",
		fontSize: 18,
		lineHeight: 35,
	},
});
