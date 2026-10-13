import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="two"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'house.fill', android: 'home', web: 'home' }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tareas"
        options={{
          title: 'Tareas',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'checklist', android: 'checklist', web: 'checklist' }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="materias"
        options={{
          title: 'Materias',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'book.fill', android: 'menu_book', web: 'menu_book' }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
}