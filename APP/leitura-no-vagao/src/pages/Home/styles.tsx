import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 20,
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        fontWeight: "bold"
    },
    image:{
        width: 92,
        height: 92,
        borderRadius: 12
    }
});
