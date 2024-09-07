import { View, Text, Image } from "react-native";

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
		<View>
			<Text>{id}</Text>
			<Image source={{ uri: url }} style={{ height: 200, width: 200 }} />
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
