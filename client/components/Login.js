import AsyncStorage from "@react-native-async-storage/async-storage"; // I HATE THIS LIB
import { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, TextInput, View } from "react-native";
import tailwind from "tailwind-rn";

import { api_url } from "../config.json";
import Form from "./Form";

export default function Login({ route, navigation }) {
    const [status, changeStatus] = useState("");
    const [sql, changeSql] = useState("");

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

    const sendSql = async (q) => {
        fetch(api_url + "sql", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sql: q }),
        })
            .then((res) => {
                changeStatus(res);
            })
            .catch((e) => {
                changeStatus(e.message);
                console.log(e);
            });
    };

    const tryLogin = async ({ username, password }) => {
        if (!username || !password)
            return changeStatus("Must fill both fields.");
        changeStatus("Loading...");
        fetch(api_url + "users", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
            .then((res) => {
                res.json().then(async (json) => {
                    console.log(json);
                    if (json.error) {
                        changeStatus(json.error);
                    } else {
                        // LOGGED IN
                        try {
                            changeStatus("Logged in");
                            await AsyncStorage.setItem("@token", json.token);
                            await AsyncStorage.setItem("@username", username);
                            await AsyncStorage.setItem("@loggedIn", "true");
                            navigation.navigate("Home");
                        } catch (e) {
                            console.log(e);
                        }
                    }
                });
            })
            .catch((e) => {
                changeStatus(e.message);
                console.log(e);
            });
    };

    return (
        <SafeAreaView style={tailwind("flex-1 items-center justify-center ")}>
            <View
                style={tailwind(
                    "bg-pink-700 items-center justify-center flex-col py-8 px-4 rounded-lg"
                )}
            >
                <Text
                    style={tailwind(
                        "font-semibold text-blue-400 bg-red-300 rounded-lg w-11/12 py-2 text-center"
                    )}
                >
                    LOGIN
                </Text>
                <Form
                    inputs={[
                        {
                            style: tailwind(
                                "bg-pink-600 border-green-600 border-2 text-green-600 rounded-lg w-52"
                            ),
                            placeholder: "Username",
                            varname: "username",
                            defaultValue: route.params
                                ? route.params.username
                                : "bruh",
                        },
                        {
                            style: tailwind(
                                "bg-blue-700 border-red-500 border-2 rounded-lg w-52"
                            ),
                            placeholder: "Password",
                            varname: "password",
                            defaultValue: "bruh",
                        },
                    ]}
                    onPress={tryLogin}
                    title="LOGIN"
                />
                <Text>{status}</Text>
            </View>

            <TextInput
                value={sql}
                placeholder={"sql"}
                onChangeText={changeSql}
            />
            <Button onPress={() => sendSql(sql)} title={"SEND SQL"} />
            <Button
                title="REGISTER"
                onPress={() => {
                    navigation.navigate("Register");
                }}
            />
        </SafeAreaView>
    );
}
