import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Card from '../components/Card';
import CustomInput from '../components/Input';
import CustomButton from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/colors';

// Pantalla de inicio de sesión
const Login = ({ navigation }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const onSubmit = async () => {
        setError(null);
        setCargando(true);
        try {
            await login(email, password);
            // onAuthStateChanged se encarga de navegar a la app
        } catch (e) {
            setError(e.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Card style={styles.card}>
                <Text style={styles.title}>Iniciar sesión</Text>

                <CustomInput
                    label="Correo"
                    placeholder="Correo"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                <CustomInput
                    label="Contraseña"
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {error && <Text style={styles.error}>{error}</Text>}

                <CustomButton
                    title={cargando ? 'Entrando...' : 'Entrar'}
                    onPress={onSubmit}
                    disabled={cargando}
                    loading={cargando}
                />

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>
            </Card>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: colors.primaryDark,
    },
    link: {
        color: colors.primary,
        textAlign: 'center',
        marginTop: 16,
    },
    error: {
        color: colors.danger,
        marginTop: 8,
        textAlign: 'center',
    },
});
