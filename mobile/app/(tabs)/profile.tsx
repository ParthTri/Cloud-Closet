import React from 'react';
import { View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  const goToHome = () => {
    
    router.push('../auth/signin');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Log out" onPress={goToHome} color="red" />
    </View>
  );
}