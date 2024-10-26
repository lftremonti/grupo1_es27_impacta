import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    bookCover: {
        width: 200,
        height: 300,
        marginTop: 10,
        alignSelf: 'center',
    },
    bookTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bookAuthor: {
        fontSize: 18,
        textAlign: 'center',
        color: theme.colors.secondary80,
    },
    bookRating: {
        fontSize: 18,
        textAlign: 'center',
        color: '#FFD700',
        marginBottom: 4
    },
    sectionTitle: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 18,
        fontWeight: 'bold',
    },
    bookDescription: {
        fontSize: 16,
        lineHeight: 24,
        color: theme.colors.secondary80,
    },
    readButton: {
        marginTop: 10,
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    readButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadMoreButton: {
        marginTop: 10,
        marginBottom: 35,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: theme.colors.primary,
        borderRadius: 5,
    },
    loadMoreText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    commentContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    userIcon: {
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    commentUser: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    commentRating: {
        color: '#FFD700',
        marginVertical: 5,
    },
    commentText: {
        fontSize: 14,
        marginBottom: 5,
    },
    commentDate: {
        fontSize: 12,
        color: '#888',
    },
    commentsList: {
        flexGrow: 0,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        paddingBottom: 10,
        textAlign: 'center',
    },
    totalReviews: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 15,
    },
    backButton: {
        textAlign: 'left',
        marginBottom: 20,
    },
    backArrowColor: {
        color: theme.colors.secondary55,
    },
});
