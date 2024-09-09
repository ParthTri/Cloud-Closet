import { View, Text, Image, ScrollView, StyleSheet } from "react-native";

interface Category {
	categoryID: number;
	name: string;
}

interface ItemProps {
	id: string;
	url: string;
	categories: Category[];
}

export default function ClosetItem({ id, url, categories }: ItemProps) {
	return (
		<View style={styles.container}>
			<Text>{id}</Text>
			<Image source={{ uri: url }} style={styles.image} />
			<View>
				{categories == undefined
					? ""
					: categories.map((val) => (
							<Text key={val.categoryID}>{val.name}</Text>
					  ))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "45%",
		borderColor: "#D7AF9D",
		borderWidth: 2,
		margin: 10,
		alignItems: "center",
		borderRadius: 10,
		minHeight: 250,
	},
	image: {
		width: 150,
		height: 150,
	},
});
