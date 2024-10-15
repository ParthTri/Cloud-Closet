import { View, Text, FlatList, Alert, Image, Pressable, Dimensions, ScrollView, StyleSheet, TextInput } from "react-native";
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import { Logo } from "@/components/Logo";
import { getUser  } from "../lib/auth.ts";
import { useAuth } from '../authContext';
import axios from 'axios';
import React, { Suspense, useState, useEffect } from "react";

// API URLS
const OUTFIT_CATEGORIES_API_URL = 'https://cloudcloset.kolide.co.nz/api/outfitCategory/all'; //Get all clothing categories API
const SAVE_OUTFIT_API_URL = 'http://cloudcloset.kolide.co.nz/api/outfit/'; 

interface Category {
  id: number;
  name: string;
  timestamp: string;
}

const fallbackCategories = {
  data: [
    { created_at: "2024-10-05T01:23:35.632087+00:00", id: 1, name: "Spring" },
    { created_at: "2024-10-05T01:23:49.004092+00:00", id: 2, name: "Summer" },
    { created_at: "2024-10-05T01:24:00.620179+00:00", id: 3, name: "Fall" },
    { created_at: "2024-10-05T01:24:11.974037+00:00", id: 4, name: "Winter" },
    { created_at: "2024-10-05T01:24:24.265579+00:00", id: 5, name: "Formal" },
    { created_at: "2024-10-05T01:24:35.839981+00:00", id: 6, name: "Informal" }
  ],
  error: null
};
//const { width } = Dimensions.get("window");

async function getUserItems(
	userID: string | undefined,
	filter: string
): Promise<any[]> {
	if (userID == undefined) {
		return [{}];
	}
	let data;
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

export default function Outfits() {
  const user = getUser();
	const userID: string | undefined = user?.userId;
  const [items, setItems] = useState<any[]>([]);
  const [topsImages, setTopsImages] = useState<any[]>([]);
  const [bottomsImages, setBottomsImages] = useState<any[]>([]);
  const [footwearImages, setFootwearImages] = useState<any[]>([]);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
 // const [categories, setCategories] = useState([]);
  const [categories, setCategories] = useState(fallbackCategories.data); // temporary
  const [currentIndex, setCurrentIndex] = useState(0);
  const [outfitName, setOutfitName] = useState<string>('');
  const [isEditable, setIsEditable] = useState(true);
  const [currentImages, setCurrentImages] = useState<any[]>([]);

 // Loading category data status
 const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
 const [fetchError, setFetchError] = useState<string | null>(null);
 
 // Function to get outfit categories
 const fetchOutfitCategories = async () => {
   try {
/* bring this back after
	 const response = await axios.get(OUTFIT_CATEGORIES_API_URL);
	 if (Array.isArray(response.data.data)) {
	   setCategories(response.data.data);
	   setIsLoadingCategories(false); 
	 } else {
	   console.error('Unexpected response format:', response.data);
	 }
*/
   setCategories(fallbackCategories.data); // temporary
   setIsLoadingCategories(false); // temporary
   } catch (error) {
	 console.error('Error fetching categories:', error);
   }
 };

 // Function to save outfit 
  const saveOutfit = async () => {
    try {
      const outfitData = {
        name: outfitName,
        categories: selectedCategories,
        items: items.map(item => item.id), 
      };
      const response = await axios.post(SAVE_OUTFIT_API_URL, outfitData);
      if (response.status === 200) {
        Alert.alert('Success', 'Outfit saved successfully!');
        setSelectedCategories([]);
        setOutfitName('');
      } else {
        Alert.alert('Sorry, there was an issue.', 'Outfit could not be saved.');
      }
    } catch (error) {
      console.error('Error saving outfit:', error);
      Alert.alert('Error', 'An error occurred while saving the outfit.');
    }
  };

  // Get Items & Categories
  useEffect(() => {
    getUserItems(userID, "").then((x) => setItems(x["data"]));
    fetchOutfitCategories();
    console.log("top images url: ", topsImages[currentIndex]?.imageURL);
  }, []);
  
  // Left Button
  const handleLeftPress = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? currentImages.length - 1 : prevIndex - 1
    );
  };

  // Right Button 
  const handleRightPress = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const saveOutfitWithCategories = async () => {
	//await uploadImage();
	setSelectedCategories([]);
  };

// Function to select a category
  const selectedCategory = (categoryID: number) => {
    if (selectedCategories.includes(categoryID)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryID));
    } else {
      setSelectedCategories([...selectedCategories, categoryID]);
    }
  };

  // Update the currently displayed image array
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setCurrentImages(topsImages);
    } else {
    
      const filteredItems = items.filter(item => selectedCategories.includes(item.categoryID));
      setCurrentImages(filteredItems);
    }
  }, [selectedCategories, topsImages, bottomsImages, footwearImages, items]);

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerContainer}>
        <Logo logoWidth={30} logoHeight={30} />
        <Text style={styles.header}>CLOUD CLOSET</Text>
        <MaterialIcons name="swipe" size={30} color="black" />
      </View>

      <ScrollView>
        {/* Tops Slider */}
        <Text style={styles.sliderTitleText}>Tops</Text>
        <View style={styles.sliderContainer}>
          {/* Left Button */}
          <Pressable onPress={handleLeftPress}>
            <Entypo name="chevron-thin-left" size={50} color="#8ABAE3"/>
          </Pressable>
        
          {/* get Tops photos for slider */}
          {topsImages.length > 0 ? (
            <Image
              source={{ uri: topsImages[currentIndex]?.imageURL }} 
              style={styles.sliderImage} 
            />
          ) : (
            <Text>Loading 'Tops' Images...</Text>
          )}
          
          {/* Right Button */}
          <Pressable onPress={handleRightPress}>
            <Entypo name="chevron-thin-right" size={50} color="#8ABAE3"/>
          </Pressable>
        </View>

        {/* Bottoms Slider */}
        <Text style={styles.sliderTitleText}>Bottoms</Text>
        <View style={styles.sliderContainer}>
          {/* Left Button */}
          <Pressable>
            <Entypo name="chevron-thin-left" size={50} color="#8ABAE3"/>
          </Pressable>
          
          {/* Get the bottoms image for the slider */}
          {bottomsImages.length > 0 ? (
            <Image
              source={{ uri: bottomsImages[currentIndex]?.imageURL }} 
              style={styles.sliderImage} 
            />
          ) : (
            <Text>Loading 'Bottoms' Images...</Text>
          )}
          
          {/* Right Button */}
          <Pressable>
            <Entypo name="chevron-thin-right" size={50} color="#8ABAE3"/>
          </Pressable>
        </View>
        
        {/* Footwear Slider */}
        <Text style={styles.sliderTitleText}>Footwear</Text>
        <View style={styles.sliderContainer}>
          {/* Left Button */}
          <Pressable>
            <Entypo name="chevron-thin-left" size={50} color="#8ABAE3"/>
          </Pressable>
          
          {/* Get the Footwear image for the slider */}
          {footwearImages.length > 0 ? (
            <Image
              source={{ uri: footwearImages[currentIndex]?.imageURL }} 
              style={styles.sliderImage} 
            />
          ) : (
            <Text>Loading 'Footwear' Images...</Text>
          )}

          {/* Right Button */}
          <Pressable>
            <Entypo name="chevron-thin-right" size={50} color="#8ABAE3"/>
          </Pressable>
        </View>

        {/* Category selection */}
        <Text style={styles.selectCategoryTitleText}>Select categories:</Text>
        {isLoadingCategories ? (
          <Text>Loading categories...</Text>
        ) : fetchError ? (
          <View>
            <Text style={{ color: 'red' }}>{fetchError}</Text>
            <Pressable onPress={fetchOutfitCategories} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
        <ScrollView horizontal>
              <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                      <Pressable
                        key={category.id}
                        onPress={() => selectedCategory(category.id)}
                        style={[
                          styles.categoryButton,
                          selectedCategories.includes(category.id) && styles.selectedCategory,
                        ]}
                      >
                        <Text style={styles.categoryText}>{category.name}</Text>
                      </Pressable>
                    ))}
              </View>
        </ScrollView>
        )}

        {/* Outfit Name Input */}
        <Text style={styles.outfitNameText}>Outfit Name:</Text>
        <View style={styles.outfitNameContainer}>
          <TextInput 
            style={styles.textInputText} 
            editable={isEditable} 
            value={outfitName} 
            onChangeText={(text) => setOutfitName(text)} 
            placeholder="eg. Night Out, Workout Fit, ..."
          />
          <Pressable onPress={() => setIsEditable(!isEditable)}>
            <View style={styles.iconContainer}>
              {isEditable ? (
                <Ionicons name="checkmark-circle-outline" size={24} color="green"/>
              ) : (
                <MaterialIcons name="cancel" size={24} color="red" />
              )}
              <Text style={styles.iconLabel}>
                {isEditable ? "Confirm Name" : "Cancel Name"}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Save Outfit Button */}
        <Pressable
          style={[
            styles.saveButton,
            { backgroundColor: buttonPressed ? "#F9F9F9" : "#8ABAE3" }, //Change color according to status
          ]}
          onPressIn={() => setButtonPressed(true)} // When the button is pressed
          onPress={saveOutfit} // Save Outfit
          onPressOut={() => setButtonPressed(false)} // When the button is released
        >
          <Text style={styles.saveButtonText}>SAVE OUTFIT</Text>
        </Pressable>
      </ScrollView>
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
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
	},
	sliderTitleText: {
		color: "#8ABAE3",
		paddingVertical: 40,
		paddingHorizontal: 10,
		fontWeight: "bold",
		fontSize: 20,
	},
	selectCategoryTitleText : {
		color: "#8ABAE3",
		paddingHorizontal: 10,
		paddingBottom: 5,
		fontWeight: "bold",
		fontSize: 20,
	},
	saveButton: {
		backgroundColor: "#8ABAE3",
		borderRadius: 15,
		paddingVertical: 10,
		paddingHorizontal: 30,
		marginTop: 20,
		alignItems: "center",
		borderWidth: 2,
	  },
	saveButtonText: {
		fontSize: 18,
		fontWeight: "bold",
	  },
	categoriesContainer: {
		maxHeight: 60,
        flexDirection: 'row',
    },
    categoryButton: {
        backgroundColor: '#eee',
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 5,
        borderRadius: 10,
		maxHeight: 40,
    },
    selectedCategory: {
        backgroundColor: '#007AFF', 
    },
    categoryText: {
        color: '#000',
        fontSize: 16,
    },
	sliderImage: {
		width: 100,
		height: 100,
		borderRadius: 8,
	},
	sliderContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	retryButton: {
		marginTop: 10,
		padding: 10,
		backgroundColor: '#8ABAE3',
		borderRadius: 5,
		alignItems: 'center',
	},
	retryButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
	},
	outfitNameText: {
		color: "#8ABAE3",
		paddingVertical: 10,
		paddingHorizontal: 10,
		fontWeight: "bold",
		fontSize: 20,
	},
	textInputText: {
		flex: 1, 
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center", 
		color: "#000000",
		backgroundColor: "#D0D0D0",
		borderRadius: 5,
		padding: 10, 
		paddingHorizontal: 10,
		fontSize: 14, 
		borderWidth: 1, 
		borderColor: "#A0A0A0", 
	  },
	  outfitNameContainer: { 
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
	  },
	  iconLabel: {
		marginLeft: 5,                
		fontSize: 12,                 
		color: '#666',
	  },
	  iconContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8, 
	  },
});
