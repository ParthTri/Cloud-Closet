import ClosetItem from "@/components/ClosetItem";
import { Suspense, useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TextInput,
	Pressable,
} from "react-native";
import { useAuth } from "../authContext";
import Feather from "@expo/vector-icons/Feather";

async function getUserItems(userID: string | undefined): Promise<any[]> {
	if (userID == undefined) {
		return [{}];
	}
	const data = await fetch(
		`http://cloudcloset.kolide.co.nz/api/image/${userID}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		}
	);
	const json = await data.json();
	return json;
}

export default function Closet() {
	const { user } = useAuth();
	const userID: string | undefined = user?.userID;
	const [items, setItems] = useState<any[]>([{}]);
	useEffect(() => {
		getUserItems(userID).then((x) => setItems(x));
	}, []);

	return (
		<View
			style={{
				backgroundColor: "#fff",
			}}
		>
			{/* Search bar */}
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<TextInput
					style={styles.searchBar}
					onChangeText={(text) => setSearch(text)}
				></TextInput>
				<Pressable onPress={() => searchForItem(search)}>
					<Feather name="search" size={31} color="black" />
				</Pressable>
			</View>
			<Suspense fallback={<Text>Loading...</Text>}>
				<FlatList
					data={items}
					keyExtractor={(item) => item["id"]}
					numColumns={2}
					columnWrapperStyle={styles.row}
					renderItem={({ item }) => (
						<ClosetItem
							id={item["userID"]}
							url={item["rawUrl"]}
							categories={item["categories"]}
						/>
					)}
				/>
			</Suspense>
		</View>
	);
}

const styles = StyleSheet.create({
	itemContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		width: "100%",
		flex: 1,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	searchBar: {
		width: "80%",
		height: 64,
		backgroundColor: "#F1F1F1",
		borderRadius: 15,
		color: "#000",
		fontSize: 24,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
});
