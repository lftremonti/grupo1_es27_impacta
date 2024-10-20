import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 34,
    fontFamily: theme.fonts.title700,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginVertical: 10,
    marginBottom: 5
  },
  instructions: {
    fontSize: 13,
    fontFamily: theme.fonts.text400,
    color: theme.colors.secondary80,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fonts.text400,
    fontWeight: 'bold',
    color: theme.colors.secondary55,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: theme.colors.secondary90,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 22,
    marginBottom: 15,
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
  sendSignIn: {
    fontSize: 14,
    fontFamily: theme.fonts.text400,
    color: theme.colors.secondary55,
    textAlign: 'center',
    marginBottom: 30,
  },
  sendSignInLink: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  button: {
    height: 50,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonSignUp: {
    height: 50,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: theme.fonts.text400,
    fontWeight: 'bold',
    color: '#fff',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: theme.colors.secondary75,
  },
  orText: {
    fontSize: 14,
    fontFamily: theme.fonts.text400,
    color: theme.colors.secondary80,
    marginHorizontal: 10,
  },
  googleButton: {
    height: 50,
    borderColor: theme.colors.secondary90,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary90,
    marginBottom: 20,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.text400,
    fontWeight: 'bold',
  },
  signUpText: {
    fontSize: 14,
    fontFamily: theme.fonts.text400,
    color: theme.colors.secondary80,
    textAlign: 'center',
  },
  signUpLink: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    textAlign: 'left',
    marginBottom: 20,
  },
  backArrowColor: {
    color: theme.colors.secondary55,
  },
  forgotPasswordLink: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  brino:{
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 15,
    marginBottom: 20,
},
searchIcon: {
    marginRight: 10,
},
searchInput: {
    flex: 1,
},
pcontainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  pbrino: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 15,
  },
  psearchInput: {
    flex: 1, // Isso garante que o TextInput ocupe o máximo de espaço possível
    fontSize: 16,
    paddingLeft: 10,
  },
  psearchIcon: {
    paddingLeft: 10,
    color: '#333', // Cor do ícone
  },

  label2: {
    fontSize: 14,
    fontFamily: theme.fonts.text400,
    fontWeight: 'bold',
    color: theme.colors.secondary55,
    marginBottom: 5,
  },
  input2: {
    borderColor: theme.colors.secondary90,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 22,
    backgroundColor: theme.colors.secondary90,
  },
  pbrino2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.secondary90, // Usando a mesma cor dos outros inputs
    borderRadius: 5, // Borda arredondada similar aos outros inputs
    backgroundColor: theme.colors.secondary90, // Mesma cor de fundo
    height: 50, // Mesma altura dos outros campos de entrada
    paddingHorizontal: 10, // Espaçamento horizontal interno
    marginBottom: 15,
  },
  psearchInput2: {
    flex: 1, // Garante que o TextInput ocupe o espaço disponível
    fontSize: 16,
    paddingLeft: 10,
    backgroundColor: 'transparent', // Removendo fundo no TextInput para combinar com o contêiner
  },
  psearchIcon2: {
    paddingLeft: 10,
    color: theme.colors.secondary55, // Mesma cor para o ícone
  },
});
