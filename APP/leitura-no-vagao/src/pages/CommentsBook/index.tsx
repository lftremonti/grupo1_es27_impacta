import { RouteProp } from "@react-navigation/native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../routes/app.routes";
import { View } from "react-native";

type CommentsBookProps = {
    route: RouteProp<RootStackParamList, 'CommentsBook'>;
    navigation: StackNavigationProp<RootStackParamList, 'CommentsBook'>;
};

export default function CommentsBook({ route }: CommentsBookProps) {
    return(
        <View></View>
    );
}