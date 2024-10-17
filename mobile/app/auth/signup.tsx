import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { Link, useRouter } from "expo-router";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function SignUp() {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);
  const [checkboxIsChecked, setCheckbox] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fullNameRegex = /^[a-zA-Z']+(\s[a-zA-Z']+)*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateInputs = () => {
    if (!fullNameRegex.test(name)) {
      setErrorMessage("Please enter a valid full name.");
      return false;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return false;
    }

    if (!checkboxIsChecked) {
      setErrorMessage("You must agree to the terms and conditions.");
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (!validateInputs()) {
      setShowError(true);
      return;
    }

    try {
      const response = await fetch("http://cloudcloset.kolide.co.nz/api/user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: name,
          Email: email.toLowerCase(),
          Password: password,
        }),
      });
      const json = await response.json();
      if (json.error) {
        setErrorMessage(json.error);
        setShowError(true);
      } else {
        setShowError(false);
        router.push("/(tabs)");
      }
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
      setShowError(true);
    }
  };

  return (
    <View style={styles.container}>
      <Link href="/" style={styles.back} asChild>
        <AntDesign name="leftcircleo" size={30} color="black" />
      </Link>

      <View style={styles.header}>
        <Text style={styles.welcomeText}>Join us</Text>
        <Text style={styles.promptText}>Create your account below</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your full name"
          onChangeText={setName}
          value={name}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          inputMode="email"
          placeholder="you@example.com"
          onChangeText={setEmail}
          value={email}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="••••••"
          onChangeText={setPassword}
          value={password}
        />

        {showError && <Text style={styles.errorText}>{errorMessage}</Text>}

        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            fillColor="#8ABAE3"
            isChecked={checkboxIsChecked}
            onPress={() => setCheckbox(!checkboxIsChecked)}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxText}>
            I agree to the terms & conditions
          </Text>
        </View>
      </View>

      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={submit}
        style={[
          styles.button,
          {
            backgroundColor: pressed ? "#fff" : "#8ABAE3",
            borderColor: pressed ? "#8ABAE3" : "#fff",
          },
        ]}
      >
        <Text style={{ color: pressed ? "#8ABAE3" : "#fff", fontSize: 16 }}>
          Sign Up
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

      <Pressable onPress={() => router.push("/auth/signin")}>
        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.linkText}>Sign In</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  back: {
    position: "absolute",
    top: 70,
    left: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  signUpText: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 60,
  },
  welcomeText: {
    marginTop: 50,
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
  checkboxContainer: {
    flexDirection: "row",
    //alignItems: "flex-end",
    marginBottom: 20,
  },
  checkboxText: {
    margin: 8,
  },
  checkbox: {
    alignSelf: "auto",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 78,
    borderRadius: 28,
    borderColor: "#8ABAE3",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
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
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
  },
  orContinueText: {
    color: "#8E8E8E",
    fontSize: 16,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#8E8E8E",
  },
  linkText: {
    color: "#8ABAE3",
    fontWeight: "bold",
  },
});
