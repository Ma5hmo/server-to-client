import {
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
    Button,
    Text,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import { api_url } from "../config.json";
import * as countries from "../countries.json";
import { useReducer, useState } from "react";
import tailwind from "tailwind-rn";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO:
// 1. FIX WEIRD ERROR THAT POPS UP WHILE CHOOSING COUNTRY
// 2. IMPLEMENT UserProfile.js
export default function ProfileSetup({ navigation }) {
    const [state, setState] = useReducer(
        (state, { prop, text }) => {
            return { ...state, [prop]: text };
        },
        { fname: "", lname: "", pfp: "", country: "", bio: "" }
    );

    const [open, setOpen] = useState(false);
    const [countryCode, setCountryCode] = useState("");
    const [items, setItems] = useState(countries.default);

    const [status, setStatus] = useState("");

    const sendReq = async ({ fname, lname, photo_url, bio }, country) => {
        setStatus("Loading...");

        try {
            const res = await fetch(api_url + "users/profile/setup/", {
                method: "POST",
                headers: {
                    token: await AsyncStorage.getItem("@token"),
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: fname,
                    last_name: lname,
                    bio,
                    photo_url,
                    country,
                }),
            });
            const j = await res.text();
            setStatus(j);
            // navigation.navigate("UserProfile");
        } catch (e) {
            setStatus(e.message);
            console.log("failed");
            console.error(e.message);
            return;
        }
    };
    return (
        <SafeAreaView style={tailwind("items-center justify-center")}>
            <View
                style={tailwind(
                    "bg-gray-800 px-6 pt-4 rounded-lg items-center justify-center"
                )}
            >
                <Text
                    style={tailwind(
                        "font-semibold bg-gray-500 rounded-lg text-center w-3/4 text-gray-50"
                    )}
                >
                    Update Your Profile
                </Text>
                <TextInput
                    style={tailwind(
                        "bg-gray-700 border border-gray-900 text-gray-50 text-sm rounded-t-lg rounded-b-none w-52"
                    )}
                    placeholder="First Name"
                    placeholderTextColor="white"
                    onChangeText={(text) => setState({ prop: "fname", text })}
                />
                <TextInput
                    style={tailwind(
                        "bg-gray-700 border border-gray-900 text-gray-50 text-sm w-52"
                    )}
                    placeholderTextColor="white"
                    placeholder="Last Name"
                    onChangeText={(text) => setState({ prop: "lname", text })}
                />
                <TextInput
                    style={tailwind(
                        "bg-gray-700 border border-gray-900 text-gray-50 text-sm w-52"
                    )}
                    placeholderTextColor="white"
                    placeholder="Profile Picture URL"
                    onChangeText={(text) =>
                        setState({ prop: "photo_url", text })
                    }
                />
                <DropDownPicker
                    placeholder="Choose Country"
                    placeholderStyle={tailwind("text-gray-50")}
                    style={tailwind(
                        "bg-gray-700 border border-gray-900 text-gray-50"
                    )}
                    open={open}
                    value={countryCode}
                    items={items}
                    setOpen={setOpen}
                    setValue={setCountryCode}
                    setItems={setItems}
                />
                <TextInput
                    placeholderTextColor="white"
                    placeholder="Biography"
                    onChangeText={(text) => setState({ prop: "bio", text })}
                    multiline={true}
                    style={tailwind(
                        "bg-gray-700 border border-gray-900 text-gray-50 text-sm h-24 w-52 rounded-b-lg"
                    )}
                />
                <Button
                    onPress={() => sendReq(state, countryCode)}
                    title="SETUP"
                    color="#374151"
                />
                <Text style={tailwind("text-gray-50")}>{status}</Text>
            </View>
        </SafeAreaView>
    );
}
