import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: theme.fonts.title700,
        color: theme.colors.primary,
    },
    bookRatingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    bookRatingStars: {
        fontSize: 18,
        marginRight: 5,
        color: '#FFD700'
    },
    bookRatingAverage: {
        fontSize: 16,
        color: '#555',
        marginRight: 5
    },
    ratingContainer: {
        flexDirection: 'column-reverse',
        marginVertical: 10,
    },
    starButton: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 10,
    },
    star: {
        fontSize: 24,
        color: '#FFD700',
    },
    percentage: {
        fontSize: 12,
        color: '#FFD700',
    },
    reviewContainer: {
        marginVertical: 5,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    reviewComment: {
        fontSize: 14,
    },
    reviewDate: {
        fontSize: 12,
        marginTop: 5,
    },
    backButton: {
        textAlign: 'left',
        marginBottom: 20,
    },
    backArrowColor: {
        color: theme.colors.secondary55,
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
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFD700',
    },
    percentageText: {
        fontSize: 12,
        color: '#555',
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
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
    },
    modalCloseButtonText: {
        fontSize: 16,
        color: '#333333',
    },
    sortContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sortButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
    },
    sortButtonText: {
        fontSize: 16,
        color: '#333333',
    },
});
