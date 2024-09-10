import ClosetItem from "@/components/ClosetItem";
import { Suspense, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { useAuth } from "../authContext";

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
