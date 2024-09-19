import { View, Alert, StyleSheet, Modal, Pressable, Image } from "react-native";
import ItemCategory from "./ItemCategory";
import { Category } from "@/app/lib/category";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

interface ModalProps {
	itemID: string;
	show: boolean;
	setShow: (x: boolean) => void;
	imageURL: string;
	catergories: Category[] | undefined;
	imageID: number;
	removeItem: (id: string) => void;
}

async function deleteUserItem(imageID: number) {
	if (!imageID) return;

	const response = await fetch(
		`http://cloudcloset.kolide.co.nz/api/image/${imageID}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		}
	);
	if (response.ok) {
		return true;
	} else {
		console.error("Delete error", response);
		return false;
	}
}

export default function ItemModal({
	itemID,
	show,
	setShow,
	imageURL,
	imageID,
	catergories,
	removeItem,
}: ModalProps) {
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={show}
			onRequestClose={() => {
				setShow(!show);
			}}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Pressable onPress={() => setShow(!show)} style={styles.close}>
						<AntDesign name="closecircleo" size={29} color="black" />
					</Pressable>
					<Image source={{ uri: imageURL }} style={styles.image} />
					<View style={{ flexDirection: "row" }}>
						{catergories == undefined
							? ""
							: catergories.map((val) => (
									<ItemCategory categoryID={val.categoryID} name={val.name} />
							  ))}
					</View>
					<Pressable
						style={styles.bin}
						onPress={() => {
							Alert.alert(
								"Confirm Delete",
								"Are you sure you want to delete this item?",
								[
									{
										text: "Cancel",
										onPress: () => console.log("cancel delete"),
										style: "cancel",
									},
									{
										text: "OK",
										onPress: async () => {
											const success = await deleteUserItem(imageID);
											if (success) {
												setShow(!show);
												removeItem(imageID);
											}
										},
									},
								],
								{ cancelable: false }
							);
						}}
					>
						<Feather name="trash-2" size={24} color="black" />
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
	image: {
		width: 150,
		height: 150,
	},
	close: {
		position: "absolute",
		right: 10,
		top: 10,
	},
	bin: {
		position: "absolute",
		left: 10,
		bottom: 10,
	},
});
