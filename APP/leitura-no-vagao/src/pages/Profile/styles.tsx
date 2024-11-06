import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    profileImageContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    profileImage: {
        height: 140,
        width: 140,
        borderRadius: 25
    },
    editIconContainer: {
        height: 35,
        width: 35,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -22,
        marginLeft: 45
    },
    nameRoleContainer: {
        alignItems: "center",
        marginVertical: 10
    },
    name: {
        fontFamily: theme.fonts.title500,
        fontSize: 10,
    },
    role: {
        fontFamily: theme.fonts.text400,
        fontSize: 10,
    },
    inputFieldsContainer: {
        marginVertical: 10
    },
    icon: {
        marginHorizontal: 10
    },
    logoutButton: {
        borderWidth: 1,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginVertical: 10
    },
    logoutText: {
        fontSize: 10,
    },
    label: {
        fontSize: 14,
        fontFamily: theme.fonts.text400,
        fontWeight: 'bold',
        color: theme.colors.secondary55,
        marginBottom: 5,
    },
    input: {
        borderColor: theme.colors.secondary90,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 22,
        backgroundColor: theme.colors.secondary90,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: theme.colors.secondary90,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: theme.colors.secondary90,
        marginBottom: 20,
    },
    inputPassword: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
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
    backButton: {
    },
    backArrowColor: {
        color: theme.colors.secondary55,
    },
    welcome: {
        fontSize: 34,
        fontFamily: theme.fonts.title700,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginVertical: 10,
        marginBottom: 5
    },
    button: {
        height: 50,
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 14,
        fontFamily: theme.fonts.text400,
        fontWeight: 'bold',
        color: '#fff',
    },
    viewInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.secondary90,
        borderRadius: 5,
        backgroundColor: theme.colors.secondary90,
        height: 50,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingLeft: 10,
        backgroundColor: 'transparent',
    },
    searchIcon: {
        paddingLeft: 10,
        color: theme.colors.secondary55,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    
    modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'center',
    },
    
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    
    modalButton: {
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    
    modalButtonText: {
        fontSize: 16,
        color: '#073F72',
    },
    
    modalCloseButton: {
        marginTop: 10,
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
    },
    
    modalCloseButtonText: {
        fontSize: 16,
        color: '#FF0000',
    },    
})