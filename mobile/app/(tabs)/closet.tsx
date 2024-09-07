import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

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
	console.log(json);
	return json;
}

export default function Closet() {
	const userID: string | null = getValueFor("userID");
	console.log(userID);
	const [items, setItems] = useState<any[]>([{}]);
	useEffect(() => {
		getUserItems(userID).then((x) => setItems(x));
		console.log(items);
	}, []);

	return (
		<View>
			{items.map((element) => (
				<Text key={element.imageID}>{element["imageID"]}</Text>
			))}
		</View>
	);
}
