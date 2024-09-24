import FontAwesome from "@expo/vector-icons/FontAwesome";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
	return (
		<Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
			<Tabs.Screen
				name="index"
				options={{
					title: "",
					tabBarIcon: ({ color }) => (
						<FontAwesome size={32} name="home" color={color} />
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="closet"
				options={{
					title: "",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="wardrobe-outline"
							size={32}
							color={color}
						/>
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="upload"
				options={{
					title: "",
					tabBarIcon: ({ color }) => (
						<SimpleLineIcons name="cloud-upload" size={32} color={color} />
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="calendar"
				options={{
					title: "",
					tabBarIcon: ({ color }) => (
						<Ionicons name="calendar-outline" size={32} color={color} />
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "",
					tabBarIcon: ({ color }) => (
						<Ionicons name="person-circle-outline" size={32} color={color} />
					),
					headerShown: false,
				}}
			/>
		</Tabs>
	);
}
