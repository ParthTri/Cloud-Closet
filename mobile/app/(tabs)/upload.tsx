import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Modal,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import {
  Camera,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "../authContext";
import { Logo } from "@/components/Logo";
import { Link, router } from "expo-router";
import { usePermissions } from "expo-media-library";

const API_URL = "http://cloudcloset.kolide.co.nz/api/image";
const CATEGORIES_API_URL = "http://cloudcloset.kolide.co.nz/api/categories";

interface Category {
  categoryID: number;
  name: string;
}

export default function Upload() {
  const { user } = useAuth();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    usePermissions();
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  // const cameraRef = useRef<Camera | null >(null);
  const cameraRef = React.useRef<CameraView>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategorySelectionVisible, setIsCategorySelectionVisible] =
    useState(false);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);

  const mimeTypeToExtension: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
  };

  const getFileExtensionFromMimeType = (mimeType: string): string => {
    return mimeTypeToExtension[mimeType] || "unknown";
  };

  const requestPermissions = async () => {
    const cameraStatus = await requestCameraPermission();
    const mediaLibraryStatus = await requestMediaLibraryPermission();
    return cameraStatus.granted && mediaLibraryStatus.granted;
  };

  async function takePicture() {
    const allPermissions = await requestPermissions();
    // permissions granted - take picture
    if (allPermissions) {
      if (cameraRef.current) {
        const options = {
          quality: 1,
          base64: true,
          fixOrientation: true,
          exif: true,
        };

		if (photo.uri) { // only an error until picture is taken (photo becomes defined)
			setSelectedImage(photo.uri);
			setIsModalVisible(true);
		} else {
			Alert.alert('Error', 'Could not take picture');
		}
		} else {
		Alert.alert('Permissions Not Granted', 'Please allow all permissions in Settings.');
		}
  }};

  const uploadImage = async () => {
    if (!selectedImage || selectedCategories.length === 0) {
      Alert.alert("Error", "Please select an image and at least one category");
      return;
    }

    setUploading(true);

    try {
      let filename: string | undefined;
      let base64Image: string;

      if (selectedImage.startsWith("data:")) {
        const mimeType = selectedImage.split(";")[0].split(":")[1];
        filename = `image.${getFileExtensionFromMimeType(mimeType)}`;
        base64Image = selectedImage;
      } else if (selectedImage.startsWith("file://")) {
        const cleanUri = selectedImage.replace(/^file:\/\//, "");
        filename = cleanUri.split("/").pop();
        const extension = filename?.split(".").pop();
        if (!filename) {
          throw new Error("Filename could not be determined from URI");
        }
        const mimeType =
          extension === "jpg" ? "image/jpeg" : `image/${extension}`;
        const base64 = await FileSystem.readAsStringAsync(cleanUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // Get base64
        //base64Image = `data:${mimeType};base64,${base64}`;
        base64Image = base64;
      } else {
        throw new Error("Unsupported URI format");
      }

      const body = {
        image: base64Image,
        fileName: filename,
        categories: selectedCategories.join(","),
        userID: user?.userID,
      };

      await axios.post(API_URL, body, {
        headers: { "Content-Type": "application/json" },
      });

      Alert.alert(
        "Upload successful",
        "Your image has been uploaded successfully."
      );
      setSelectedImage(null);
      setSelectedCategories([]);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload failed", "There was an error uploading your image.");
    } finally {
      setUploading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORIES_API_URL);
      if (Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const selectedCategory = (categoryID: number) => {
    if (selectedCategories.includes(categoryID)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryID)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryID]);
    }
  };

  const saveImageWithCategories = async () => {
    await uploadImage();
    setSelectedCategories([]);
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Logo logoWidth={30} logoHeight={30} />
        <Text style={styles.header}>CLOUD CLOSET</Text>
        <Link href="/(tabs)" style={styles.closeButton} asChild>
          <AntDesign name="closecircleo" size={30} color="black" />
        </Link>
      </View>

      <Button
        title="Upload from Library"
        onPress={async () => {
          const allPermissions = await requestPermissions();
          if (allPermissions) {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            });

            if (!result.canceled) {
              setSelectedImage(result.assets[0].uri);
              setIsModalVisible(true);
            }
          } else {
            Alert.alert(
              "Permissions Not Granted",
              "Please allow all permissions in Settings."
            );
          }
        }}
      />

      <CameraView
        ref={cameraRef}
        style={styles.cameraContainer}
        facing="back"
        autofocus="on"
      />

      <Button title="Take Picture" onPress={takePicture} />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalView}>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
            />
          )}
          {!isCategorySelectionVisible ? (
            <>
              <Text style={styles.modalText}>
                Are you happy with this image?
              </Text>
              <View style={styles.modalButton}>
                <Button
                  title="Yes"
                  onPress={() => setIsCategorySelectionVisible(true)}
                />
                <Button title="No" onPress={() => setIsModalVisible(false)} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.modalText}>Select categories:</Text>
              <ScrollView style={styles.categoriesContainer} horizontal={true}>
                {categories.map((category) => (
                  <Pressable
                    key={category.categoryID}
                    onPress={() => selectedCategory(category.categoryID)}
                    style={[
                      styles.categoryButton,
                      selectedCategories.includes(category.categoryID) &&
                        styles.selectedCategory,
                    ]}
                  >
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <View style={styles.modalButton}>
                <Button title="Save" onPress={saveImageWithCategories} />
                <Button
                  title="Cancel"
                  onPress={() => setIsModalVisible(false)}
                />
              </View>
            </>
          )}
        </View>
      </Modal>
    </ScrollView>
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
    alignItems: "center",
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 30,
    alignSelf: "center",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 20,
    height: 30,
    width: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 1000,
    backgroundColor: "transparent",
  },
  cameraContainer: {
    flex: 1,
  },
  text: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 11,
  },
  button: {
    fontWeight: "bold",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  selectedImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 15,
  },
  modalText: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  categoriesContainer: {
    maxHeight: 60,
    flexDirection: "row",
  },
  categoryButton: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    borderRadius: 10,
    maxHeight: 40,
  },
  selectedCategory: {
    backgroundColor: "#007AFF",
  },
  categoryText: {
    color: "#000",
    fontSize: 16,
  },
});
