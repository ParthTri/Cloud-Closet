import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Logo } from "@/components/Logo";
import { Link } from "expo-router";
{
  /*import { useAuth } from './authContext'; */
}

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Logo logoWidth={300} logoHeight={300} style={styles.logo} />
      <View style={styles.linksContainer}>
        <Link href="/auth/signup" style={styles.link}>
          <Text style={styles.text}>Sign Up</Text>
        </Link>
        <Link href="/auth/signin" style={[styles.link, styles.signInLink]}>
          <Text style={[styles.text, styles.signInText]}>Sign In</Text>
        </Link>
        {/*<Link href='./(tabs)/homepage'style={styles.link}>
		<Text style={styles.text}>Home Page</Text></Link>*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "20%",
    backgroundColor: "#fff",
  },
  logo: {
    marginTop: 100,
  },
  linksContainer: {
    flex: 1,
    justifyContent: "center",
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
    marginVertical: 10, // Adjusts the vertical space between buttons
  },
  text: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 35,
  },
  signInLink: {
    backgroundColor: "#fff",
    borderColor: "#8ABAE3",
    borderWidth: 3,
  },
  signInText: {
    color: "#8ABAE3",
    lineHeight: 30,
  },
  userInfo: {
    margin: 20,
  },
});

export default HomeScreen;
