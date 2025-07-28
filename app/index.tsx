import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/theme';

export default function Index() {
  useEffect(() => {
    // Rediriger directement vers la page d'accueil
    router.replace('/home');
  }, []);

  // Afficher un indicateur de chargement pendant la redirection
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}