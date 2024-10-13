import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface CodeInputProps {
  value: string;
  onChange: (code: string) => void;
  maxLength?: number;
  hasError?: boolean; // Nova propriedade
}

const CodeInput: React.FC<CodeInputProps> = ({ value, onChange, maxLength = 6, hasError = false  }) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, maxLength);
  }, [maxLength]);

  const handleTextChange = (text: string, index: number) => {
    // Remove caracteres não numéricos
    text = text.replace(/\D/g, '');

    const newCode = value.split('');
    newCode[index] = text;
    onChange(newCode.join(''));

    // Move focus to the next input if text is added
    if (text && index + 1 < maxLength) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      const newCode = value.split('');
      
      // Limpa o campo atual se não houver texto
      if (newCode[index] === '') {
        // Mover foco para o campo anterior se o atual estiver vazio
        if (index > 0) {
          inputRefs.current[index - 1]?.focus(); // Foca no anterior
        }
      } else {
        // Limpar valor no campo atual
        newCode[index] = '';
        onChange(newCode.join(''));
  
        // Verificar se ainda há texto no campo atual após a remoção
        if (index > 0 && newCode[index] === '') {
          // Mover foco para o campo anterior
          inputRefs.current[index - 1]?.focus();
        }
      }
    }
  };  

  return (
    <View style={styles.container}>
      {Array(maxLength).fill(null).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => inputRefs.current[index] = ref}
          style={[styles.input, hasError && styles.errorInput]} // Aplica estilo de erro se necessário
          value={value[index] || ''}
          onChangeText={(text) => handleTextChange(text, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          keyboardType="number-pad"
          maxLength={1}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20
  },
  input: {
    width: 40,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    textAlign: 'center',
    fontSize: 24,
    marginHorizontal: 5,
  },
  errorInput: {
    borderBottomColor: 'red', // Cor vermelha quando houver erro
  },
});

export default CodeInput;