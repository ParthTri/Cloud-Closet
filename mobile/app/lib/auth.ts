import * as SecureStore from "expo-secure-store";

interface User {
	userId: string;
	email: string;
	accessToken: string;
}

export async function loginUser(userData: User): Promise<void> {
	await SecureStore.setItemAsync("userId", userData.userId);
	await SecureStore.setItemAsync("email", userData.email);
	await SecureStore.setItemAsync("accessToken", userData.accessToken);
}

export function getUser(): User | null {
	const userId: string | null = SecureStore.getItem("userId");
	if (userId == null) {
		return null;
	}
	const email: string | null = SecureStore.getItem("email");
	if (email == null) {
		return null;
	}
	const accessToken: string | null = SecureStore.getItem("accessToken");
	if (accessToken == null) {
		return null;
	}

	const userData: User = {
		userId: userId,
		email: email,
		accessToken: accessToken,
	};

	return userData;
}
