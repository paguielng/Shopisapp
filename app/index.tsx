
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/constants/theme';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Sur le web (Netlify, Replit), toujours montrer d'abord la page de connexion
      if (Platform.OS === 'web') {
        // Forcer la redirection vers login, même si un user existe dans le cache
        router.replace('/(auth)/login');
      } else {
        // Comportement normal pour mobile
        if (user) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(auth)/login');
        }
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return null;
}
