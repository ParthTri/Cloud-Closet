import ClosetItem from "@/components/ClosetItem";
import * as SecureStore from "expo-secure-store";
import { Suspense, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";

function getValueFor(key: string): string | null {
	return SecureStore.getItem(key);
}

async function getUserItems(userID: string | null): Promise<any[]> {
	if (userID == null) {
		return [{}];
	}
	const data = await fetch(`http://192.168.1.36:3000/api/image/${userID}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});
	const json = await data.json();
	return json;
}

export default function Closet() {
	const userID: string | null = getValueFor("userID");
	const [items, setItems] = useState<any[]>([{}]);
	useEffect(() => {
		getUserItems(userID).then((x) => setItems(x));
	}, []);

	return (
		<View>
			{/* TODO: Search bar */}
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
});
