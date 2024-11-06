// LoadingAnimation.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Lottie from 'lottie-react-native';
import { theme } from '../global/styles/theme';

const LoadingAnimation = () => {
    return (
        <View style={styles.container}>
            <Lottie
                source={require('../assets/AnimationTrain.json')} // ajuste o caminho conforme necessário
                autoPlay
                loop
                style={styles.animation} // Usando o estilo para a animação
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centraliza verticalmente
        alignItems: 'center', // Centraliza horizontalmente
        backgroundColor: theme.colors.primary, // Cor de fundo
    },
    animation: {
        width: 400,
        height: 400,
        marginBottom: 200
    },
});

export default LoadingAnimation;
