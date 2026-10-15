import { BlurView } from '@sbaiahmed1/react-native-blur';
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type HomeStackParams = { Home: undefined; Details: undefined };

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParams>();

const COLORS = ['#e63946', '#2a9d8f', '#e9c46a', '#457b9d', '#8338ec', '#fb8500'];

const Card = ({ index, label }: { index: number; label: string }) => (
  <View style={[styles.card, { backgroundColor: COLORS[index % COLORS.length] }]}>
    <Text style={styles.cardText}>{label}</Text>
  </View>
);

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<HomeStackParams>>();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Home</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Details')}>
        <Text style={styles.buttonText}>Push "Details"</Text>
      </Pressable>
      {Array.from({ length: 8 }, (_, i) => (
        <Card key={i} index={i} label={`Home card ${i + 1}`} />
      ))}
    </ScrollView>
  );
};

const DetailsScreen = () => (
  <ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>Details</Text>
    <Text style={styles.body}>
      If you can read this right after the push, the screen rendered correctly.
    </Text>
    {Array.from({ length: 8 }, (_, i) => (
      <Card key={i} index={i + 3} label={`Details card ${i + 1}`} />
    ))}
  </ScrollView>
);

const OtherScreen = () => (
  <View style={styles.center}>
    <Text style={styles.title}>Other tab</Text>
  </View>
);

const HomeNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{ headerShown: false, contentStyle: styles.screen }}
  >
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="Details" component={DetailsScreen} />
  </HomeStack.Navigator>
);

// Custom tab bar floating over the content, with a BlurView as background.
// Replacing <BlurView> with a plain <View> makes the issue disappear.
const BlurTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom + 16 }]}>
      <BlurView
        blurAmount={40}
        blurType="dark"
        overlayColor="rgba(32, 30, 51, 0.6)"
        reducedTransparencyFallbackColor="rgba(32, 30, 51, 0.6)"
        style={styles.tabBar}
      >
        {state.routes.map((route, index) => (
          <Pressable
            key={route.key}
            style={styles.tab}
            onPress={() => navigation.navigate(route.name)}
          >
            <Text style={[styles.tabText, state.index === index && styles.tabTextActive]}>
              {route.name}
            </Text>
          </Pressable>
        ))}
      </BlurView>
    </View>
  );
};

const renderTabBar = (props: BottomTabBarProps) => <BlurTabBar {...props} />;

const TabNavigator = () => (
  <Tab.Navigator tabBar={renderTabBar} screenOptions={{ headerShown: false }}>
    <Tab.Screen name="HomeTab" component={HomeNavigator} />
    <Tab.Screen name="OtherTab" component={OtherScreen} />
  </Tab.Navigator>
);

const App = () => (
  <SafeAreaProvider>
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{ headerShown: false, contentStyle: styles.screen }}
      >
        <RootStack.Screen name="Tabs" component={TabNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  screen: { backgroundColor: '#0b0b1a' },
  content: { padding: 24, paddingTop: 64, paddingBottom: 160, gap: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b0b1a' },
  title: { color: 'white', fontSize: 32, fontWeight: '700' },
  body: { color: 'white', fontSize: 16 },
  button: { backgroundColor: 'white', borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#0b0b1a', fontSize: 18, fontWeight: '600' },
  card: { height: 140, borderRadius: 16, justifyContent: 'flex-end', padding: 16 },
  cardText: { color: 'white', fontSize: 18, fontWeight: '600' },
  tabBarContainer: { position: 'absolute', left: 16, right: 16, bottom: 0 },
  tabBar: { flexDirection: 'row', borderRadius: 16, overflow: 'hidden', padding: 8 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabText: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 16 },
  tabTextActive: { color: 'white', fontWeight: '700' },
});

export default App;
