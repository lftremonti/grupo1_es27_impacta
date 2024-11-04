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
    bookRatingContainer: {
        alignItems: 'center',
        marginVertical: 5,
    },
    bookRatingStars: {
        fontSize: 20,
        color: '#FFD700',
    },
    bookRatingAverage: {
        fontSize: 16,
        color: '#000',
    },
    sectionTitle: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
        fontFamily: theme.fonts.title500,
    },
    bookDescription: {
        fontSize: 16,
        lineHeight: 24,
        color: theme.colors.secondary80,
        flexWrap: 'wrap',
        marginTop: 5,
        marginVertical: 5
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
        backgroundColor:'#f0f0f0',
        borderRadius: 20,
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
        color: theme.colors.primary,
        fontWeight: 'bold',
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
    toggleDescriptionText: {
        color: theme.colors.primary,
        marginTop: 5,
        fontWeight: 'bold',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    paginationDot: {
        fontSize: 30,
        color: '#ccc',
    },
    activeDot: {
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333333',
    },
    modalItem: {
        paddingVertical: 8,
        width: '100%',
        alignItems: 'center',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333333',
    },
    modalCloseButton: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    modalCloseButtonText: {
        fontSize: 16,
        color: '#333333',
    },
    commentInput: {
        width: '100%',
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        textAlignVertical: 'top', // ensures text starts at the top of the box
        fontSize: 16,
        color: '#333',
    },
    selectedStar: {
        color: '#FFD700', // gold color for selected stars
    },
    starRatingContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    ratingPrompt: {
        fontSize: 16,
        marginVertical: 10,
        color: '#333',
    },
    commentStart:{
        fontSize: 30,
        color: '#FFF', // start with white fill for unselected
        textShadowColor: '#FFD700', // gold color border
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    }
});
