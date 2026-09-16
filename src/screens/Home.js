import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../components/Card';
import CustomButton from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/colors';

// Pantalla principal: muestra la información del usuario que inició sesión
const Home = ({ navigation }) => {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mi perfil</Text>

            <Card style={styles.card}>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.value}>{user?.displayName || 'Sin nombre registrado'}</Text>

                <Text style={styles.label}>Correo</Text>
                <Text style={styles.value}>{user?.email}</Text>

                <CustomButton
                    title="Editar"
                    onPress={() => navigation.navigate('EditProfile')}
                />
            </Card>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: colors.primaryDark,
    },
    card: {
        width: '100%',
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.textMuted,
        marginTop: 12,
    },
    value: {
        fontSize: 18,
        color: colors.text,
        marginTop: 4,
    },
});
