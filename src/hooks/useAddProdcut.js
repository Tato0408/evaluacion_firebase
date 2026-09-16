import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { database } from '../config/firebase';

const PRODUCTO_INICIAL = { nombre: '', precio: '' };

/**
 * Maneja el formulario de alta de un producto y su guardado en Firestore.
 */
export const useAgregarProducto = () => {
    const [producto, setProducto] = useState(PRODUCTO_INICIAL);
    const [guardando, setGuardando] = useState(false);

    // Actualiza un solo campo del formulario
    const setCampo = (campo, valor) => setProducto((prev) => ({ ...prev, [campo]: valor }));

    const reset = () => setProducto(PRODUCTO_INICIAL);

    // Guarda el producto; devuelve true si se guardó correctamente
    const guardar = async () => {
        if (!producto.nombre.trim()) {
            throw new Error('El nombre es obligatorio.');
        }
        setGuardando(true);
        try {
            await addDoc(collection(database, 'productos'), {
                nombre: producto.nombre.trim(),
                precio: Number(producto.precio) || 0,
                vendido: false,
                creado: new Date(),
            });
            reset();
            return true;
        } finally {
            setGuardando(false);
        }
    };

    return { producto, setCampo, guardar, guardando, reset };
};
