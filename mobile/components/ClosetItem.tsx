import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import ItemCategory from "./ItemCategory";
import { useState } from "react";
import ItemModal from "./ItemModel";

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
	const [show, setShow] = useState(false);

	return (
		<Pressable onPress={() => setShow((x) => !x)} style={styles.container}>
			<ItemModal
				show={show}
				setShow={setShow}
				imageURL={url}
				catergories={categories}
			/>
			<View>
				<Text>{id}</Text>
				<Image source={{ uri: url }} style={styles.image} />
				<View style={styles.category}>
					{categories == undefined
						? ""
						: categories.map((val) => (
								<ItemCategory categoryID={val.categoryID} name={val.name} />
						  ))}
				</View>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "45%",
		borderColor: "#D7AF9D",
		borderWidth: 2,
		margin: 10,
		alignItems: "center",
		borderRadius: 20,
		minHeight: 250,
		justifyContent: "center",
		padding: 5,
		zIndex: 2,
	},
	image: {
		width: 150,
		height: 150,
	},
	category: {
		flexDirection: "row",
	},
});
