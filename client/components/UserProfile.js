import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { Image, SafeAreaView, View, Text, Button } from "react-native";
import tailwind from "tailwind-rn";
import { api_url } from "../config.json";
import { useFocusEffect } from "@react-navigation/native";

// TODO:
//       1. ADD DATE OF BIRTH TO UserProfile.js PAGE
//       2. implement PostUpload.js
//       3. search profile system

export default function UserProfile({ route, navigation }) {
    const [profileInfo, setProfileInfo] = useState({});
    const { first_name, last_name, photo_url, bio, country } = profileInfo;

    function countryCodeToEmoji(cc) {
        // offset between uppercase ascii and regional indicator symbols
        const OFFSET = 127397;
        const codePoints = [...cc.toUpperCase()].map(
            (c) => c.codePointAt() + OFFSET
        );
        return String.fromCodePoint(...codePoints);
    }
    const CapitalizeName = (first, last) => {
        return (
            last.charAt(0).toUpperCase() +
            last.slice(1) +
            ", " +
            first.charAt(0).toUpperCase() +
            first.slice(1)
        );
    };

    useFocusEffect(
        useCallback(() => {
            if (!route.params.username) return navigation.navigate("Home");
            const { username } = route.params;
            fetch(api_url + "users/profile/" + username, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    token: AsyncStorage.getItem("@token"),
                },
            })
                .then(async (res) => {
                    const json = await res.json();
                    if (json.error !== "no profile found") {
                        setProfileInfo(json);
                    } else if (json.username === username) {
                        navigation.navigate("ProfileSetup");
                    } else {
                        navigation.navigate("Home");
                    }
                })
                .catch((e) => {
                    console.log(e.message);
                });
        }, [])
    );

    return (
        <SafeAreaView>
            <View
                style={tailwind(
                    "flex flex-row max-h-40 bg-gray-500 justify-center"
                )}
            >
                <View style={tailwind("flex mt-3")}>
                    <Text
                        style={tailwind(
                            "font-extrabold text-left text-xl mr-8"
                        )}
                    >
                        {first_name && CapitalizeName(first_name, last_name)}{" "}
                        {country && countryCodeToEmoji(country)}
                    </Text>
                    <Text style={tailwind("font-semibold text-left")}>
                        {"\n" + bio}
                    </Text>
                </View>
                <Image
                    style={tailwind("h-16 w-16 rounded-full")}
                    defaultSource={require("../assets/default_pfp.png")} // doesn't work on android while debugging ;(
                    source={{ uri: photo_url }}
                ></Image>
            </View>
            <Button
                onPress={() => navigation.navigate("ProfileSetup", profileInfo)}
                title="Edit profile"
                color="#374151"
            />
        </SafeAreaView>
    );
}
