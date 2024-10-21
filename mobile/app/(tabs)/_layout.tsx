import FontAwesome from "@expo/vector-icons/FontAwesome";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#8ABAE3",
				tabBarInactiveTintColor: "#8e8e93",
				tabBarStyle: {
					backgroundColor: "white",
					borderTopWidth: 0,
					height: 70,
					paddingBottom: 10,
					elevation: 12,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 3 },
					shadowOpacity: 0.15,
					shadowRadius: 4,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					paddingBottom: 5,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<FontAwesome size={28} name="home" color={color} />
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="closet"
				options={{
					title: "Closet",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="wardrobe-outline"
							size={28}
							color={color}
						/>
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="upload"
				options={{
					title: "Upload",
					tabBarIcon: ({ color }) => (
						<SimpleLineIcons name="cloud-upload" size={28} color={color} />
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="outfits"
				options={{
					title: "Outfits",
					tabBarIcon: ({ color }) => (
						<Ionicons name="shirt" size={28} color={color} />
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => (
						<Ionicons name="person-circle-outline" size={28} color={color} />
					),
					headerShown: false,
				}}
			/>
		</Tabs>
	);
}
