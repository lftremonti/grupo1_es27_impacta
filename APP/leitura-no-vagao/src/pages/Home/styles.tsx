import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
    },
    headerContent: {
        flex: 1,
        marginRight: 10,
    },
    menuIcon: {
        marginLeft: 10,
    },
    headerGreeting: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: theme.fonts.title700,
        color: theme.colors.primary,
    },
    headerQuestion: {
        fontSize: 14,
        color: theme.colors.secondary80,
        fontFamily: theme.fonts.title500,
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
        fontFamily: theme.fonts.title700,
        marginBottom: 20,
    },
    booksList: {
        paddingBottom: 20,
    },
    bookItem: {
        marginRight: 15,
        alignItems: 'center',
    },
    bookCover: {
        width: 100,
        height: 150,
        borderRadius: 10,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bookAuthor: {
        fontSize: 14,
        color: '#666',
    },
    categoryItem: {
        marginRight: 15,
        padding: 10,
        borderRadius: 5,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    activeCategory: {
        backgroundColor: theme.colors.primary,
    },
    activeCategoryText: {
        color: theme.colors.secondary85,
    },
    inactiveCategory: {
        backgroundColor: '#f0f0f0',
    },
    inactiveCategoryText: {
        color: '#666',
    },
});
