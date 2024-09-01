import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useState } from "react";

// TODO: Need to add validation that the checkbox has been ticked

export default function Signup() {
	const fullNameRegex = /^[a-zA-Z']+(\s[a-zA-Z']+)*$/;
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	const [pressed, setPressed] = useState(false);

	// User data states for pushing to API later
	const [name, setName] = useState("");
	const [nameIsValid, setNameValidity] = useState(true);

	const [email, setEmail] = useState("");
	const [emailIsValid, setEmailIsValid] = useState(true);

	const [password, setPassword] = useState("");
	const [passwordIsValid, setPasswordValidity] = useState(true);

	const submit = () => {
		console.log(
			JSON.stringify({ Name: name, Email: email, Password: password })
		);
		fetch("http://cloudcloset.kolide.co.nz/api/user", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ Name: name, Email: email, Password: password }),
		})
			.then((x) => x.json())
			.then((x) => console.log(x))
			.catch((err) => console.log(err));
	const [checkboxIsChecked, setCheckbox] = useState(false);
	const [toggleCheckMessage, setCheckMessage] = useState(false);

	const [generalError, setError] = useState(true);

	};

	return (
		<View style={{ flex: 1, padding: 10 }}>
			<Link href="/" style={styles.back} asChild>
				<AntDesign name="leftcircleo" size={30} color="black" />
			</Link>
			<View style={styles.header}>
				<Text style={{ fontSize: 24 }}>Sign Up</Text>
				<Text style={{ fontSize: 48 }}>Welcome</Text>
				<Text style={{ fontSize: 18 }}>Please create your account here</Text>
			</View>
			<View
				style={{ padding: 20, height: "50%", justifyContent: "space-evenly" }}
			>
				<View>
					<Text style={styles.label}>Full name</Text>
					<TextInput
						style={styles.input}
						placeholder="Maggie"
						onChangeText={(text) => setName(text)}
					></TextInput>
				</View>
				<View>
					<Text style={styles.label}>Email</Text>
					<TextInput
						style={styles.input}
						inputMode="email"
						onChangeText={(text) => setEmail(text)}
					></TextInput>
				</View>
				<View>
					<Text style={styles.label}>Password</Text>
					<TextInput
						style={styles.input}
						secureTextEntry={true}
						onChangeText={(text) => setPassword(text)}
					></TextInput>
				</View>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
					<BouncyCheckbox
						disableText
						fillColor="#8ABAE3"
						innerIconStyle={{ borderRadius: 0 }}
						iconStyle={{ borderRadius: 0 }}
					/>
					<Text>I agree with the terms & conditions</Text>
				</View>
			</View>
			<Pressable
				onPressIn={(e) => setPressed(true)}
				onPressOut={(e) => setPressed(false)}
				onPress={() => submit()}
				style={({ pressed }) => [
					styles.button,
					{
						backgroundColor: pressed ? "#8ABAE3" : "#fff",
						color: "#fff",
					},
				]}
			>
				<Text
					style={{
						color: pressed ? "#fff" : "#8ABAE3",
					}}
				>
					Sign Up
				</Text>
			</Pressable>
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
		maxHeight: "20%",
	},
	label: {
		fontSize: 22,
	},
	input: {
		width: "100%",
		height: 64,
		backgroundColor: "#F1F1F1",
		borderRadius: 15,
		color: "#000",
		fontSize: 24,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	button: {
		padding: 10,
		width: 245,
		textAlign: "center",
		height: 55,
		backgroundColor: "#fff",
		borderRadius: 25,
		overflow: "hidden",
		borderColor: "#8ABAE3",
		borderWidth: 1,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
		color: "8ABAE3",
	},
});
