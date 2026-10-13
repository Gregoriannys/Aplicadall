import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { obtenerToken } from '@/lib/token';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    obtenerToken().then((token) => {
      router.replace(token ? '/two' : '/login');
    });
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}