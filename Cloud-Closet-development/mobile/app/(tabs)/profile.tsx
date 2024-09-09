import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';


type RootStackParamList = {
  Profile: undefined;
  Welcome: undefined;
};

export default function Profile() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const goToWelcome = () => {
    // 导航到欢迎界面的逻辑
    navigation.navigate('Welcome');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* I created a button that returns */}
      <Button title="log out" onPress={goToWelcome} />
    </View>
  );
}



