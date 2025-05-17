import { Redirect } from 'expo-router';

export default function Home() {
  // Redirect to the main tab route
  return <Redirect href="/(tabs)" />;
}
