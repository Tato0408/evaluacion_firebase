import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import Card from '../components/Card';
import CustomInput from '../components/Input';
import CustomButton from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/colors';

// Pantalla para editar la información del usuario y re-iniciar sesión con los datos nuevos
const EditProfile = ({ navigation }) => {
    const { user, updateUserProfile } = useAuth();
    const [nombre, setNombre] = useState(user?.displayName || '');
    const [correo, setCorreo] = useState(user?.email || '');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [contrasenaActual, setContrasenaActual] = useState('');
    const [error, setError] = useState(null);
    const [guardando, setGuardando] = useState(false);

    const onGuardar = async () => {
        setError(null);

        if (!correo.trim()) {
            setError('El correo es obligatorio.');
            return;
        }
        if (!contrasenaActual) {
            setError('Ingresa tu contraseña actual para confirmar los cambios.');
            return;
        }

        setGuardando(true);
        try {
            await updateUserProfile({ nombre, correo, nuevaContrasena, contrasenaActual });
            navigation.goBack();
        } catch (e) {
            setError(e.message);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <Card style={styles.card}>
                    <Text style={styles.title}>Editar información</Text>

                    <CustomInput
                        label="Nombre"
                        placeholder="Tu nombre"
                        value={nombre}
                        onChangeText={setNombre}
                        autoCapitalize="words"
                    />
                    <CustomInput
                        label="Correo"
                        placeholder="correo@ejemplo.com"
                        value={correo}
                        onChangeText={setCorreo}
                        keyboardType="email-address"
                    />
                    <CustomInput
                        label="Nueva contraseña (opcional)"
                        placeholder="Dejar en blanco para no cambiarla"
                        value={nuevaContrasena}
                        onChangeText={setNuevaContrasena}
                        secureTextEntry
                    />
                    <CustomInput
                        label="Contraseña actual"
                        placeholder="Necesaria para confirmar los cambios"
                        value={contrasenaActual}
                        onChangeText={setContrasenaActual}
                        secureTextEntry
                    />

                    {error && <Text style={styles.error}>{error}</Text>}

                    <CustomButton
                        title={guardando ? 'Guardando...' : 'Guardar cambios'}
                        onPress={onGuardar}
                        disabled={guardando}
                        loading={guardando}
                    />
                    <CustomButton
                        title="Cancelar"
                        variant="secondary"
                        onPress={() => navigation.goBack()}
                        disabled={guardando}
                    />
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: colors.primaryDark,
    },
    error: {
        color: colors.danger,
        marginTop: 8,
        textAlign: 'center',
    },
});
