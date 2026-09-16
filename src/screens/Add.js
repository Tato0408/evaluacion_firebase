import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import { useAgregarProducto } from '../hooks/useAgregarProducto';
import { colors } from '../constants/colors';

// Pantalla para agregar un nuevo producto
const Add = ({ navigation }) => {
    const { producto, setCampo, guardar, guardando } = useAgregarProducto();

    const agregarProducto = async () => {
        try {
            await guardar();
            Alert.alert('Producto agregado', 'El producto se agregó correctamente', [
                { text: 'Ok', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert('Error', error.message || 'Ocurrió un error al agregar el producto.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Agregar producto</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setCampo('nombre', text)}
                        value={producto.nombre}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Precio:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setCampo('precio', text)}
                        value={String(producto.precio)}
                        keyboardType="numeric"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, guardando && styles.buttonDisabled]}
                    onPress={agregarProducto}
                    disabled={guardando}
                >
                    <Text style={styles.buttonText}>
                        {guardando ? 'Guardando...' : 'Agregar producto'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Volver a home</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Add;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: colors.primaryDark,
    },
    input: {
        height: 40,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 4,
        paddingLeft: 8,
        backgroundColor: colors.surface,
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        width: '100%',
    },
    button: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: colors.disabled,
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: colors.text,
    },
    inputContainer: {
        width: '100%',
        padding: 16,
        backgroundColor: colors.background,
        marginBottom: 16,
    },
});
