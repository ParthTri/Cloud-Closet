import { View, Text, StyleSheet, Modal, Pressable, Image } from "react-native";
import ItemCategory from "./ItemCategory";
import { Category } from "@/app/lib/category";

interface ModalProps {
	show: boolean;
	setShow: (x: boolean) => void;
	imageURL: string;
	catergories: Category[] | undefined;
}

export default function ItemModal({
	show,
	setShow,
	imageURL,
	catergories,
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
					<Image source={{ uri: imageURL }} style={styles.image} />
					<Text style={styles.modalText}>Hello World!</Text>
					<View style={{ flexDirection: "row" }}>
						{catergories == undefined
							? ""
							: catergories.map((val) => (
									<ItemCategory categoryID={val.categoryID} name={val.name} />
							  ))}
					</View>
					<Pressable
						style={[styles.button, styles.buttonClose]}
						onPress={() => setShow(!show)}
					>
						<Text style={styles.textStyle}>Hide Modal</Text>
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
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	buttonClose: {
		backgroundColor: "#2196F3",
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
});
