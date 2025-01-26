import { StyleSheet } from 'react-native';
import { theme } from '../../../global/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 22
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  button: {
    height: 50,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
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
  pickerStyle: {
    width: '100%',
    borderRadius: 10,  // Bordas arredondadas dentro do Picker
    backgroundColor: theme.colors.secondary90
  },
  selectedPickerItem: {
    color: theme.colors.secondary90, // Cor do item selecionado
  },
  viewInputImage:{
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.secondary90,
    borderRadius: 5,
    backgroundColor: theme.colors.secondary90,
    height: 170,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  descriptionInput:{
    width: '100%',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
    backgroundColor: 'transparent',
  },
  backButton: {
    textAlign: 'left',
    marginBottom: 1,
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
  searchIcon: {
    paddingLeft: 10,
    color: theme.colors.secondary55,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: theme.fonts.text400,
    fontWeight: 'bold',
    color: '#fff',
  },
  bookCover: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
  }
});