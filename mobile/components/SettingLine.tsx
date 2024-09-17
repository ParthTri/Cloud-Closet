import { View, Text, StyleSheet } from "react-native";
import { Children } from "react";

export default function SettingLine({ children }) {
	return <View style={styles.conatiner}>{children}</View>;
}

const styles = StyleSheet.create({
	conatiner: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
	},
});
