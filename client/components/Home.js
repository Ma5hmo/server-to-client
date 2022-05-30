import { Text, View, SafeAreaView, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export default function Home({ navigation }) {
    const [isLoggedIn, setLoggedIn] = useState("");

    useEffect(() => {
        AsyncStorage.getItem("@loggedIn").then(setLoggedIn);
    }, []);

    return (
        <SafeAreaView>
            <View>
                {/* <Text>{isLoggedIn}</Text> */}
                <Button
                    title="Log out"
                    onPress={async () => {
                        await AsyncStorage.setItem("@loggedIn", "false");
                        await AsyncStorage.removeItem("@token");
                        navigation.navigate("Login");
                    }}
                />
                <Button
                    title="Go to your profile"
                    onPress={() => {
                        navigation.navigate("UserProfile");
                    }}
                />
            </View>
        </SafeAreaView>
    );
}
