import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: theme.fonts.title700,
        color: theme.colors.primary,
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
    headerQuestion: {
        fontSize: 14,
        color: theme.colors.secondary80,
        fontFamily: theme.fonts.title500,
        marginBottom: 20,
    },
    backButton: {
        textAlign: 'left',
        marginBottom: 20,
    },
    backArrowColor: {
        color: theme.colors.secondary55,
    },
    animation: {
        width: 200,
        height: 200,
        marginBottom: 20
    },
    subContainer:{
        marginTop: 80,
        justifyContent: 'center', // Centraliza verticalmente
        alignItems: 'center', // Centraliza horizontalmente
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    headerContent: {
        flex: 1,
        marginRight: 10,
    },
    menuIcon: {
        marginLeft: 10,
    },
})