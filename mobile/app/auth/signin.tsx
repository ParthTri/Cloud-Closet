import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { loginUser } from "../lib/auth.ts";

export default function SignIn() {
  const [pressed, setPressed] = useState(false);
  const [forgotPressed, setForgotPressed] = useState(false);
  const [signUpPressed, setSignUpPressed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // To store error messages

  // Email validation regex
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const submit = async () => {
    // Input validation
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setShowError(true);
      return;
    }

    if (password.trim() === "") {
      setErrorMessage("Password cannot be empty.");
      setShowError(true);
      return;
    }

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
            email: email.toLowerCase(),
            password: password,
          }),
        }
      );
      const json = await res.json();
      if (json) {
        setShowError(false);
        loginUser(json.data);
        router.push("../(tabs)");
      } else {
        setErrorMessage("Incorrect username or password.");
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setShowError(true);
      console.log(error);
    }
  };

  const continueWithoutLogin = () => {
    router.push("../(tabs)");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Link href="/" style={styles.back} asChild>
        <AntDesign name="leftcircleo" size={30} color="black" />
      </Link>

      <View style={styles.header}>
        <Text style={styles.signInText}>Sign In</Text>
        <Text style={styles.welcomeText}>Welcome back</Text>
        <Text style={styles.promptText}>Please enter your account here</Text>
      </View>

      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            inputMode="email"
            placeholder="maggiemay@gmail.com"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
        <View>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            placeholder="•••••••"
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
        </View>

        {showError && <Text style={styles.errorText}>{errorMessage}</Text>}

        <View style={styles.linksContainer}>
          <Pressable
            onPressIn={() => setForgotPressed(true)}
            onPressOut={() => setForgotPressed(false)}
          >
            <Text
              style={[
                styles.linkText,
                { textDecorationLine: forgotPressed ? "underline" : "none" },
              ]}
            >
              Forgot Password?
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={() => submit()}
        style={[
          styles.button,
          {
            backgroundColor: pressed ? "#fff" : "#8ABAE3",
            borderColor: pressed ? "#8ABAE3" : "#fff",
          },
        ]}
      >
        <Text style={{ color: pressed ? "#8ABAE3" : "#fff", fontSize: 16 }}>
          Sign In
        </Text>
      </Pressable>

      <View style={styles.socialLogin}>
        <Text style={styles.orContinueText}>Or Continue with</Text>
        <View style={styles.socialButtonsContainer}>
          <Pressable style={styles.socialButton}>
            <AntDesign name="google" size={30} color="#4285F4" />
          </Pressable>
          <Pressable style={styles.socialButton}>
            <Entypo name="facebook" size={30} color="#4267B2" />
          </Pressable>
        </View>
      </View>

      <Pressable
        onPressIn={() => setSignUpPressed(true)}
        onPressOut={() => setSignUpPressed(false)}
      >
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text
            style={styles.linkText}
            onPress={() => router.push("/auth/signup")}
          >
            Sign Up
          </Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    top: 70,
    left: 20,
    marginTop: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  signInText: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 60,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  promptText: {
    fontSize: 18,
  },
  form: {
    width: "90%",
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F1F1F1",
    borderRadius: 15,
    fontSize: 18,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 78,
    borderRadius: 28,
    borderColor: "#8ABAE3",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  socialLogin: {
    alignItems: "center",
    marginTop: 20,
  },
  socialButtons: {
    flexDirection: "row",
    width: "10%",
  },
  socialIcon: {
    marginHorizontal: 10,
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  linkText: {
    fontSize: 16,
    color: "#8ABAE3",
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 16,
    color: "#8E8E8E",
  },
  signUpContainer: {
    marginTop: 30,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    marginBottom: 30,
  },
  orContinueText: {
    color: "#8E8E8E",
    fontSize: 16,
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
  },
});
