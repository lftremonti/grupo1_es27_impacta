import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Modal, Portal, Button, Paragraph, Title, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomDialogProps {
  visible: boolean;
  hideDialog: () => void;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'success' | 'fail';
}

const iconMap = {
  alert: 'alert-circle-outline',
  warning: 'warning-outline',
  success: 'checkmark-circle-outline',
  fail: 'close-circle-outline'
};

const colorMap = {
  alert: '#FFA500',
  warning: '#FFC107',
  success: '#4CAF50',
  fail: '#F44336'
};

const CustomDialog: React.FC<CustomDialogProps> = ({ visible, hideDialog, title, message, type }) => {
  const handleHideDialog = () => {
    hideDialog();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleHideDialog} contentContainerStyle={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={handleHideDialog}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.dialog}>
          <View style={styles.iconContainer}>
            <Icon name={iconMap[type]} size={40} color={colorMap[type]} />
          </View>
          <Title style={styles.title}>{title}</Title>
          <Paragraph style={styles.message}>{message}</Paragraph>
          <Button mode="contained" onPress={handleHideDialog} style={[styles.button, { backgroundColor: colorMap[type] }]}>
            <Text style={styles.buttonText}>Fechar</Text>
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalOverlay: {
    flex: 1,
  },
  dialog: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#030202'
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#030202'
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
  },
});

export default CustomDialog;