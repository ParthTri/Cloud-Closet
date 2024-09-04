import { Text, StyleSheet } from "react-native";

interface Props {
	override?: any;
	isValid: boolean;
	children: any;
}

export default function ErrorText({ override, isValid, children }: Props) {
	return (
		<Text
			style={{
				...styles.errorText,
				...override,
				display: isValid ? "flex" : "none",
			}}
		>
			{children}
		</Text>
	);
}
const styles = StyleSheet.create({
	errorText: {
		fontSize: 14,
		color: "red",
		fontStyle: "italic",
	},
});
