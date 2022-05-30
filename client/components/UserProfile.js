import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Image, SafeAreaView, View, Text, Button } from "react-native";
import tailwind from "tailwind-rn";
import { api_url } from "../config.json";

// TODO: 1. start working with redux please
//       2. implement UserProfile component

export default function UserProfile({ navigation }) {
    const [text, setText] = useState("");
    const [profileInfo, setProfileInfo] = useState({});
    const { first_name, last_name, photo_url, bio, username } = profileInfo;
    useEffect(() => {
        AsyncStorage.getItem("@username")
            .then((username) => {
                // bruh
                fetch(api_url + "users/profile/" + username, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        token: AsyncStorage.getItem("@token"),
                    },
                })
                    .then(async (res) => {
                        const json = await res.json();
                        if (json.error === "no profile found") {
                            navigation.navigate("ProfileSetup");
                            return;
                        } else {
                            setProfileInfo(json);
                        }
                    })
                    .catch((e) => {
                        setText(e.message);
                    });
            })
            .catch((e) => {
                setText(e.message);
            });
    }, []);
    const CapitalizeName = (first, last) =>
        last.charAt(0).toUpperCase() +
        last.slice(1) +
        ", " +
        first.charAt(0).toUpperCase() +
        first.slice(1);
    return (
        <SafeAreaView>
            <View>
                <Text style={tailwind("font-extrabold text-left text-xl")}>
                    {first_name ? CapitalizeName(first_name, last_name) : ""}
                </Text>
                <Image
                    style={tailwind("h-64 w-64")}
                    defaultSource={require("../assets/default_pfp.png")} // doesn't work on android while debugging ;(
                    source={{ uri: photo_url }}
                ></Image>

                <Text>{JSON.stringify(text)}</Text>
            </View>
            <Button
                onPress={() => navigation.navigate("ProfileSetup")}
                title="Edit profile"
                color="#374151"
            />
        </SafeAreaView>
    );
}
