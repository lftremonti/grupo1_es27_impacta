import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
        marginTop: 22
    },
    button: {
        height: 50,
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    backButton: {
        textAlign: 'left',
        marginBottom: 1,
    },
    backArrowColor: {
        color: theme.colors.secondary55,
    },
    label: {
        fontSize: 14,
        fontFamily: theme.fonts.text400,
        fontWeight: 'bold',
        color: theme.colors.secondary55,
        marginBottom: 5,
    },
    viewInputCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.secondary90,
        borderRadius: 10,  // Borda arredondada
        backgroundColor: theme.colors.secondary90,
        marginBottom: 15,
        paddingLeft: 10,  // Espaçamento interno
        paddingRight: 10,
    },
    map: {
        width: '100%',
        height: 450,
        marginVertical: 20
    },
    welcome: {
        fontSize: 34,
        fontFamily: theme.fonts.title700,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginVertical: 10,
        marginBottom: 5,
        textAlign: 'center',
    },
    instructions: {
        fontSize: 13,
        fontFamily: theme.fonts.text400,
        color: theme.colors.secondary80,
        marginBottom: 20,
        textAlign: 'center',
    },
    bookSearchContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        borderRadius: 10
    },
    bookSearchInfo:{
        flex: 1,
        padding: 20
    },
    bookSearchTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bookSearchAuthor:{
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    bookCover: {
        width: 100,
        height: 150,
        borderRadius: 10,
    },
})