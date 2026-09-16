import React from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Home from '../screens/Home';
import EditProfile from '../screens/EditProfile';
import Login from '../screens/Login';
import Register from '../screens/Register';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/colors';

const Stack = createNativeStackNavigator();

// Botón de cerrar sesión que se muestra en la cabecera de Home
const LogoutButton = () => {
    const { logout } = useAuth();
    return (
        <TouchableOpacity onPress={logout}>
            <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
    );
};

const screenOptions = {
    headerStyle: { backgroundColor: colors.primary },
    headerTintColor: colors.white,
    headerTitleStyle: { fontWeight: 'bold' },
};

const AppStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: 'Home', headerRight: () => <LogoutButton /> }}
        />
        <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ presentation: 'modal', title: 'Editar perfil' }}
        />
    </Stack.Navigator>
);

const AuthStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Login" component={Login} options={{ title: 'Iniciar sesión' }} />
        <Stack.Screen name="Register" component={Register} options={{ title: 'Crear cuenta' }} />
    </Stack.Navigator>
);

const Navigation = () => {
    const { user, initializing } = useAuth();

    if (initializing) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>{user ? <AppStack /> : <AuthStack />}</NavigationContainer>
    );
};

export default Navigation;

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    logout: {
        color: colors.white,
        fontWeight: 'bold',
    },
});
