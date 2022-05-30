import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./components/Home";
import Login from "./components/Login";
import ProfileSetup from "./components/ProfileSetup";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="ProfileSetup" component={ProfileSetup} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="UserProfile" component={UserProfile} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
