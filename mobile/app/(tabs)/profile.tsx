import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Profile: undefined;
  Welcome: undefined;
  index: undefined;
};

export default function Profile() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const goToHome = () => {
    navigation.navigate('index');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Log out" onPress={goToHome} color="red" />
    </View>
  );
}