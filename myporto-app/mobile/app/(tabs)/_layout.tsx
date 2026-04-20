import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconsName;
  iconFocused: IoniconsName;
}

const tabs: TabConfig[] = [
  { name: 'index', title: 'Dashboard', icon: 'home-outline', iconFocused: 'home' },
  { name: 'profile', title: 'Profil', icon: 'person-outline', iconFocused: 'person' },
  { name: 'education', title: 'Pendidikan', icon: 'school-outline', iconFocused: 'school' },
  { name: 'experience', title: 'Pengalaman', icon: 'briefcase-outline', iconFocused: 'briefcase' },
  { name: 'skills', title: 'Keahlian', icon: 'star-outline', iconFocused: 'star' },
  { name: 'appearance', title: 'Tampilan', icon: 'color-palette-outline', iconFocused: 'color-palette' },
  { name: 'payment', title: 'Bayar', icon: 'card-outline', iconFocused: 'card' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e2e8f0',
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={size - 2}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
