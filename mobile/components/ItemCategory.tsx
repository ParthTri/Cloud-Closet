import { Text, StyleSheet } from "react-native";

interface CategoryProps {
  categoryID: number;
  name: string;
}

function capitalise(word: string): string {
  return word.replace(word[0], word[0].toUpperCase());
}

export default function ItemCategory({ categoryID, name }: CategoryProps) {
  return (
    <Text style={{ ...styles.category }} key={categoryID}>
      {capitalise(name)}
    </Text>
  );
}

const styles = StyleSheet.create({
  category: {
    padding: 5,
    margin: 5,
    backgroundColor: "#8ABAE3",
    fontWeight: "bold",
    borderRadius: 20,
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 12,
  },
});
