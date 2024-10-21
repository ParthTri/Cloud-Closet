import React from 'react';
import { AuthProvider } from './authContext'; // Adjust path as needed
import { Stack } from 'expo-router'; // Import Stack from expo-router
import { View, StyleSheet } from 'react-native'; // Add View and StyleSheet for layout management

const Layout: React.FC = () => {
  return (
    <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Stack will automatically handle routing based on file structure */}
        </Stack>
    </AuthProvider>
  );
};


export default Layout;
