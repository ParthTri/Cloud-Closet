import React from 'react';
import { AuthProvider } from './authContext'; // Adjust path as needed
import { Stack } from 'expo-router'; // Import Stack from expo-router

const Layout: React.FC = () => {
  return (
    <AuthProvider>
      <Stack>
        {/* Stack will automatically handle routing based on file structure */}
      </Stack>
    </AuthProvider>
  );
};

export default Layout;
