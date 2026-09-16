import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext(null);


const traducirError = (code) => {
    switch (code) {
        case 'auth/invalid-email':
            return 'El correo no es válido.';
        case 'auth/missing-password':
            return 'Ingresa una contraseña.';
        case 'auth/weak-password':
            return 'La contraseña debe tener al menos 6 caracteres.';
        case 'auth/email-already-in-use':
            return 'Ya existe una cuenta con ese correo.';
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            return 'Correo o contraseña incorrectos.';
        case 'auth/requires-recent-login':
            return 'Por seguridad, vuelve a ingresar tu contraseña actual.';
        case 'auth/too-many-requests':
            return 'Demasiados intentos. Espera un momento e intenta de nuevo.';
        case 'auth/network-request-failed':
            return 'Sin conexión. Revisa tu internet.';
        case 'auth/operation-not-allowed':
            return 'El registro por correo y contraseña no está habilitado en Firebase.';
        case 'auth/configuration-not-found':
        case 'auth/invalid-api-key':
        case 'auth/api-key-not-valid':
            return 'La configuración de Firebase es inválida. Revisa las credenciales del proyecto.';
        default:
            // Se deja visible en consola para poder identificar códigos no mapeados
            console.error('Error de autenticación no mapeado:', code);
            return 'Ocurrió un error. Intenta nuevamente.';
    }
};


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        // Observador de la sesión: se dispara al iniciar y en cada login/logout
        const unsubscribe = onAuthStateChanged(auth, (usuario) => {
            setUser(usuario);
            setInitializing(false);
        });
        return unsubscribe;
    }, []);

    const value = useMemo(
        () => ({
            user,
            initializing,
            register: async (email, password, nombre) => {
                try {
                    const credencial = await createUserWithEmailAndPassword(auth, email.trim(), password);
                    if (nombre && nombre.trim()) {
                        await updateProfile(credencial.user, { displayName: nombre.trim() });
                    }
                    // Refresca el usuario del contexto con el displayName recién asignado
                    setUser({ ...credencial.user });
                } catch (error) {
                    throw new Error(traducirError(error.code));
                }
            },
            login: async (email, password) => {
                try {
                    await signInWithEmailAndPassword(auth, email.trim(), password);
                } catch (error) {
                    throw new Error(traducirError(error.code));
                }
            },
            logout: () => signOut(auth),
            // Edita nombre/correo/contraseña del usuario actual y vuelve a iniciar sesión con los datos nuevos
            updateUserProfile: async ({ nombre, correo, nuevaContrasena, contrasenaActual }) => {
                const usuarioActual = auth.currentUser;
                if (!usuarioActual) {
                    throw new Error('No hay una sesión activa.');
                }

                const correoActual = usuarioActual.email;
                const correoNuevo = correo.trim();

                try {
                    // Reautenticación requerida por Firebase para cambios sensibles (correo/contraseña)
                    const credential = EmailAuthProvider.credential(correoActual, contrasenaActual);
                    await reauthenticateWithCredential(usuarioActual, credential);

                    if (nombre && nombre.trim() !== usuarioActual.displayName) {
                        await updateProfile(usuarioActual, { displayName: nombre.trim() });
                    }
                    if (correoNuevo && correoNuevo !== correoActual) {
                        await updateEmail(usuarioActual, correoNuevo);
                    }
                    if (nuevaContrasena) {
                        await updatePassword(usuarioActual, nuevaContrasena);
                    }

                    // Vuelve a iniciar sesión con la info editada para refrescar la sesión por completo
                    const correoFinal = correoNuevo || correoActual;
                    const contrasenaFinal = nuevaContrasena || contrasenaActual;
                    await signOut(auth);
                    await signInWithEmailAndPassword(auth, correoFinal, contrasenaFinal);
                } catch (error) {
                    throw new Error(traducirError(error.code));
                }
            },
        }),
        [user, initializing]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para consumir el contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de <AuthProvider>');
    }
    return context;
};
