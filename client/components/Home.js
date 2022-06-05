import { Text, View, SafeAreaView, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import tailwind from "tailwind-rn";

export default function Home({ navigation }) {
    const [username, setUsername] = useState("");

    useFocusEffect(
        useCallback(() => {
            AsyncStorage.getItem("@username").then(setUsername);
            AsyncStorage.getItem("@token").then((token) => {
                if (!token) {
                    navigation.navigate("Login", { username });
                }
            });
        }, [])
    );

    function getTimeOfDay(hour) {
        if (hour >= 6 && hour < 12) return "Morning";
        if (hour < 17) return "Afternoon";
        if (hour < 21) return "Evening";
        return "Night";
    }

    return (
        <SafeAreaView>
            <View>
                <Text style={tailwind("font-semibold text-3xl")}>
                    Good {getTimeOfDay(new Date().getHours())}, {username}.
                </Text>
                <Button
                    title="Go to your profile"
                    onPress={() => {
                        navigation.navigate("UserProfile", { username });
                    }}
                />
                <Button
                    title="Upload a new post"
                    onPress={() => navigation.navigate("PostUpload")}
                />
                <Button
                    title="Log out"
                    onPress={async () => {
                        await AsyncStorage.removeItem("@token");
                        navigation.navigate("Login", { username });
                    }}
                />
            </View>
        </SafeAreaView>
    );
}
