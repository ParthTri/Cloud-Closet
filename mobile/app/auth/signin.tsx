import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import ErrorText from "@/components/ErrorText";

import React, { useState } from "react";
import { useAuth } from "../authContext";

async function save(key: string, value: string) {
	await SecureStore.setItemAsync(key, value);
}


export default function SignIn() {
	const { login } = useAuth(); // Get login function from AuthContext

	const [pressed, setPressed] = useState(false);
	const [forgotPressed, setForgotPressed] = useState(false);
	const [signUpPressed, setSignUpPressed] = useState(false);

	// User data states for pushing to API later
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [showError, setShowError] = useState(false);

	const submit = async () => {
		try {
			const res = await fetch(
				"https://cloudcloset.kolide.co.nz/api/user/signin",
				{
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: email.toLocaleLowerCase(),
						password: password,
					}),
				}
			);
			const json = await res.json();
			if (json) {
				// Assuming json.user contains user data
				setShowError(false);
				login(json); // Update AuthContext with logged-in user data
				router.push("../(tabs)");
			} else {
				setShowError(true);
			}
		} catch (error) {
			setShowError(true);
			console.log(error);
		}
	};

	const continueWithoutLogin = () => {
		// Skip login and navigate directly to next screen
		router.push("../(tabs)");
	};

	return (
		<View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
			<Link href="/" style={styles.back} asChild>
				<AntDesign name="leftcircleo" size={30} color="black" />
			</Link>
			<View style={styles.header}>
				<Text style={{ fontSize: 24 }}>Sign In</Text>
				<Text style={{ fontSize: 48, fontWeight: "bold" }}>Welcome Back</Text>
				<Text style={{ fontSize: 18 }}>Please enter your account here</Text>
			</View>
			<View
				style={{ padding: 20, height: "50%", justifyContent: "space-evenly" }}
			>
				<View>
					<Text style={styles.label}>Email</Text>
					<TextInput
						style={styles.input}
						inputMode="email"
						placeholder="maggie@gmail.com"
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
				<ErrorText isValid={showError}>
					Incorrect username or password.
				</ErrorText>
				<View style={styles.linksContainer}>
					<Pressable
						onPressIn={() => setForgotPressed(true)}
						onPressOut={() => setForgotPressed(false)}
					>
						<Text
							style={[
								styles.linkText,
								{
									textDecorationLine: forgotPressed ? "underline" : "none",
								},
							]}
						>
							Forgot password?
						</Text>
					</Pressable>

					<Pressable
						onPressIn={() => setSignUpPressed(true)}
						onPressOut={() => setSignUpPressed(false)}
					>
						<Text
							style={[
								styles.linkText,
								{ textDecorationLine: signUpPressed ? "underline" : "none" },
							]}
						>
							<Link href="/auth/signup">Don't have an account? Sign Up</Link>
						</Text>
					</Pressable>
				</View>
			</View>
			<Pressable
				onPressIn={() => setPressed(true)}
				onPressOut={() => setPressed(false)}
				onPress={() => submit()}
				style={({ pressed }) => [
					styles.button,
					{
						backgroundColor: pressed ? "#fff" : "#8ABAE3",
						color: "#fff",
					},
				]}
			>
				<Text
					style={{
						color: pressed ? "#8ABAE3" : "#fff",
					}}
				>
					Sign In
				</Text>
			</Pressable>

			{/* Continue Without Login Button */}
			<Pressable
				onPress={() => continueWithoutLogin()}
				style={[
					styles.button,
					{ backgroundColor: "#8ABAE3", marginTop: 10 },
				]}
			>
				<Text style={{ color: "#fff" }}>Continue Without Login</Text>
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
		fontWeight: "bold",
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
	linksContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
	linkText: {
		fontSize: 16,
		color: "#1276EF",
	},
	forgotButton: {
		position: "absolute",
		right: 0,
		bottom: -30,
	},
});
