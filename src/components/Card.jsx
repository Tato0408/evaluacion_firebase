import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

// Contenedor genérico con estilo de tarjeta, reutilizable en toda la app
const Card = ({ children, style }) => {
    return <View style={[styles.card, style]}>{children}</View>;
};

export default Card;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        padding: 20,
        margin: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
});
