import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, router } from "expo-router";
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

	const [checkboxIsChecked, setCheckbox] = useState(false);
	const [toggleCheckMessage, setCheckMessage] = useState(false);

	const [generalError, setError] = useState(true);

	const submit = async () => {
		try {
			let notPush = false;
			// Check Full Name
			if (!fullNameRegex.test(name)) {
				setNameValidity(false);
				notPush = true;
			} else {
				setNameValidity(true);
			}

			// Check Email formatting
			if (!emailRegex.test(email)) {
				setEmailIsValid(false);
				notPush = true;
			} else {
				setEmailIsValid(true);
			}

			// Check Password
			if (password.length < 6) {
				setPasswordValidity(false);
				notPush = true;
			} else {
				setPasswordValidity(true);
			}

			// Checkbox
			if (!checkboxIsChecked) {
				setCheckMessage(true);
				notPush = true;
			} else {
				setCheckMessage(false);
			}

			if (notPush) {
				return;
			}

			const data = await fetch("http://cloudcloset.kolide.co.nz/api/user", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ Name: name, Email: email, Password: password }),
			});
			const json = await data.json();

			// Handle email exists
			if (
				json["error"] == null &&
				json["error"] == "User email already in use"
			) {
				setEmailIsValid(false);
				return;
			}

			setError(true);
			router.push("/(tabs)");
		} catch (err) {
			console.log(err);
			setError(false);
		}
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
						style={{
							...styles.input,
							borderColor: nameIsValid ? "white" : "red",
						}}
						placeholder="Maggie"
						onChangeText={(text) => setName(text)}
					></TextInput>
					<Text
						style={{
							...styles.errorText,
							display: !nameIsValid ? "flex" : "none",
						}}
					>
						Invalid Name. Name cannot contain numbers or special characters.
					</Text>
				</View>
				<View>
					<Text style={styles.label}>Email</Text>
					<TextInput
						style={{
							...styles.input,
							borderColor: emailIsValid ? "white" : "red",
						}}
						inputMode="email"
						onChangeText={(text) => setEmail(text)}
					></TextInput>
					<Text
						style={{
							...styles.errorText,
							display: !emailIsValid ? "flex" : "none",
						}}
					>
						Invalid email. This email may already be in use.
					</Text>
				</View>
				<View>
					<Text style={styles.label}>Password</Text>
					<TextInput
						style={styles.input}
						secureTextEntry={true}
						onChangeText={(text) => setPassword(text)}
					></TextInput>
					<Text
						style={{
							...styles.errorText,
							display: !passwordIsValid ? "flex" : "none",
						}}
					>
						Invalid password. Must be more than 6 characters.
					</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						flexWrap: "wrap",
						gap: 10,
					}}
				>
					<BouncyCheckbox
						disableText
						fillColor="#8ABAE3"
						innerIconStyle={{ borderRadius: 0 }}
						iconStyle={{ borderRadius: 0 }}
						isChecked={checkboxIsChecked}
						useBuiltInState={false}
						onPress={(checked: boolean) => {
							setCheckbox(!checkboxIsChecked);
						}}
					/>
					<Text>I agree with the terms & conditions</Text>
					<Text
						style={{
							...styles.errorText,
							display: toggleCheckMessage ? "flex" : "none",
						}}
					>
						This checkbox must be ticked in order to create an account.
					</Text>
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
			<Text
				style={{
					...styles.errorText,
					display: !generalError ? "flex" : "none",
				}}
			>
				There was an error creating your account. Please try again later.
			</Text>
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
		borderWidth: 2,
		borderColor: "#fff",
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
	errorText: {
		fontSize: 14,
		color: "red",
		fontStyle: "italic",
	},
});
