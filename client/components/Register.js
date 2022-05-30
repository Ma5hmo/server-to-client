import { SafeAreaView, Text, View, Button } from "react-native";
import { useEffect, useState } from "react";
import tailwind from "tailwind-rn";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api_url } from "../config.json";
import Form from "./Form";

export default function Register({ navigation }) {
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fnc = async () => {
            if ((await AsyncStorage.getItem("@loggedIn")) != "true") {
                await AsyncStorage.setItem("@loggedIn", "false");
                await AsyncStorage.removeItem("@token");
            } else {
                navigation.navigate("Home");
            }
        };
        fnc();
    }, []);

    const tryRegister = ({ username, password, repPassword, email }) => {
        if (password != repPassword)
            return setStatus("password is not the same in both fields");
        if (!username || !password || !email)
            return setStatus("all fields must be filled");
        if (!/^.*@.*\..*$/.test(email))
            return setStatus("email not in the correct format");

        setStatus("Loading...");

        fetch(api_url + "users/register", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                email,
            }),
        })
            .catch((e) => setStatus(e.message))
            .then((res) => {
                res.json().then((json) => {
                    if (json.out) {
                        // REGISTERED THE ACCOUNT
                        navigation.navigate("Login", { username });
                        setStatus(json.out);
                    } else if (json.error) {
                        setStatus(json.error);
                    }
                });
            })
            .catch((e) => setState(e.message));
    };

    return (
        <SafeAreaView style={tailwind("items-center justify-center")}>
            <View
                style={tailwind(
                    "bg-yellow-600 px-6 pt-10 pb-7 rounded-lg items-center justify-center"
                )}
            >
                <Text
                    style={tailwind(
                        "font-semibold bg-red-300 rounded-lg text-center w-3/4"
                    )}
                >
                    REGISTER
                </Text>
                <Form
                    inputs={[
                        {
                            style: tailwind(
                                "bg-blue-900 items-center justify-center flex-col rounded-lg"
                            ),
                            placeholder: "username",
                            varname: "username",
                        },
                        {
                            style: tailwind(
                                "bg-pink-600 border-green-600 border-2 text-green-600 rounded-lg"
                            ),
                            placeholder: "Email",
                            varname: "email",
                        },
                        {
                            style: tailwind(
                                "bg-blue-700 border-red-500 border-2 rounded-lg"
                            ),
                            placeholder: "Password",
                            varname: "password",
                        },
                        {
                            style: tailwind(
                                "bg-yellow-400 border-green-600 border-2 text-green-600 rounded-lg"
                            ),
                            placeholder: "Repeat Password",
                            varname: "repPassword",
                        },
                    ]}
                    onPress={tryRegister}
                    title="REGISTER"
                />
                <Text>{status}</Text>
            </View>
            <Button
                title={"BACK TO LOGIN"}
                onPress={() => navigation.navigate("Login")}
            />
        </SafeAreaView>
    );
}
