import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import ItemCategory from "./ItemCategory";
import { useState } from "react";
import ItemModal from "./ItemModel";

interface Category {
  categoryID: number;
  name: string;
}

interface ItemProps {
  id: string;
  url: string;
  categories: Category[];
  imageID: number;
  removeItem: (id: string) => void;
}

export default function ClosetItem({
  id,
  url,
  categories,
  imageID,
  removeItem,
}: ItemProps) {
  const [show, setShow] = useState(false);

  return (
    <Pressable onPress={() => setShow((x) => !x)} style={styles.container}>
      <ItemModal
        itemID={id}
        show={show}
        setShow={setShow}
        imageURL={url}
        catergories={categories}
        removeItem={removeItem}
        imageID={imageID}
      />
      <View style={styles.innerContainer}>
        <Image source={{ uri: url }} style={styles.image} />
        <View style={styles.categoryContainer}>
          {categories === undefined
            ? ""
            : categories.map((val) => (
                <ItemCategory
                  key={val.categoryID}
                  categoryID={val.categoryID}
                  name={val.name}
                />
              ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "45%",
    borderWidth: 1,
    margin: 10,
    borderRadius: 20,
    minHeight: 250,
    justifyContent: "center",
    padding: 5,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
});
