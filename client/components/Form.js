import { useReducer } from "react";
import { Button, TextInput, View } from "react-native";
import tailwind from "tailwind-rn";

/**
 * @param {{ style: string, placeholder: string, secureTextEntry: bool, varname: string, defaultValue: string }[]} inputs Parameters for form's TextInputs
 * @param {React.Component[]} componentsBetween Components added between button and form
 * @param {function (state)} onPress Gets called on button click
 * @param {string} title Form's button title
 */
export default function Form({ inputs, componentsBetween, onPress, title }) {
    const initialState = Object.fromEntries(
        inputs.map((inp) => {
            return [
                inp.varname ? inp.varname : inp.placeholder,
                inp.defaultValue ? inp.defaultValue : "",
            ];
        })
    );

    const [state, setState] = useReducer((state, { prop, to }) => {
        return { ...state, [prop]: to };
    }, initialState);
    return (
        <View style={tailwind("flex justify-center items-center")}>
            {inputs.map((inp, index) => {
                return (
                    <TextInput
                        {...inp}
                        key={index}
                        onChangeText={(t) =>
                            setState({ prop: inp.varname, to: t })
                        }
                    />
                );
            })}
            <Button onPress={() => onPress(state)} title={title} />
        </View>
    );
}
