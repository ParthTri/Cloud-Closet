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
import { getUser  } from "../lib/auth.ts";
import { Logo } from "@/components/Logo";
import Feather from "@expo/vector-icons/Feather";

async function getUserItems(
	userID: string | undefined,
	filter: string
): Promise<any[]> {
	if (userID == undefined) {
		return [{}];
	}
	let data;
	console.log(filter.length);
	if (filter.length == 0) {
		data = await fetch(`https://cloudcloset.kolide.co.nz/api/image/${userID}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
	} else {
		data = await fetch(
			`http://cloudcloset.kolide.co.nz/api/image/search/${userID}/${filter}`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}
		);
	}

	const json = await data.json();
	return json;
}
export default function Closet() {
	const [search, setSearch] = useState<string>("");
  	const user = getUser();
	const userID: string | undefined = user?.userId;
	const [items, setItems] = useState<any[]>([{}]);

	const searchForItem = async (search: string) => {
		await getUserItems(userID, search).then((x) => {
			setItems(x["data"]);
		});
	};

	const removeItem = (id: string) => {
		setItems((currItems) => currItems.filter((i) => i.imageID !== id));
	};

	useEffect(() => {
		getUserItems(userID, "").then((x) => setItems(x["data"]));
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Logo logoWidth={30} logoHeight={30} />
				<Text style={styles.header}>CLOUD CLOSET</Text>
			</View>

			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchBar}
					onChangeText={setSearch}
					value={search}
					placeholder="Search items..."
				/>
				<Pressable onPress={() => searchForItem(search)}>
					<Feather name="search" size={31} color="black" />
				</Pressable>
			</View>

			<Suspense fallback={<Text>Loading...</Text>}>
				<FlatList
					data={items}
					keyExtractor={(item) => item["imageID"]}
					numColumns={2}
					columnWrapperStyle={styles.row}
					renderItem={({ item }) => (
						<ClosetItem
							id={item["userID"]}
							url={item["processedUrl"]}
							categories={item["categories"]}
							imageID={item["imageID"]}
							removeItem={removeItem}
						/>
					)}
				/>
			</Suspense>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#FFFFFF",
		paddingTop: 55,
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		alignContent: "center",
		paddingLeft: 30,
	},
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 10,
	},
	searchBar: {
		flex: 1,
		height: 50,
		backgroundColor: "#EDEDED",
		borderRadius: 30,
		color: "#000",
		fontSize: 20,
		paddingLeft: 20,
		marginRight: 10,
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
});
