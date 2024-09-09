import { Text, StyleSheet } from "react-native";

interface CategoryProps {
	categoryID: number;
	name: string;
}

function getRandomLightColor(): string {
	const r = Math.floor(Math.random() * 156) + 100; // 100 to 255
	const g = Math.floor(Math.random() * 156) + 100; // 100 to 255
	const b = Math.floor(Math.random() * 156) + 100; // 100 to 255
	return `rgb(${r}, ${g}, ${b})`;
}

function capitalise(word: string): string {
	return word.replace(word[0], word[0].toUpperCase());
}

export default function ItemCategory({ categoryID, name }: CategoryProps) {
	return (
		<Text
			style={{ ...styles.category, backgroundColor: getRandomLightColor() }}
			key={categoryID}
		>
			{capitalise(name)}
		</Text>
	);
}

const styles = StyleSheet.create({
	category: {
		padding: 5,
		margin: 5,
		fontWeight: "bold",
		borderRadius: 5,
	},
});
