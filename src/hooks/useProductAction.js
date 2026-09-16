import { useState } from 'react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { database } from '../config/firebase';

/**
 * Acciones sobre un producto individual: eliminar y alternar el estado 'vendido'.
 */
export const useProductoActions = () => {
    const [procesando, setProcesando] = useState(false);

    const eliminarProducto = async (id) => {
        setProcesando(true);
        try {
            await deleteDoc(doc(database, 'productos', id));
        } catch (e) {
            console.error('Error al eliminar el producto', e);
        } finally {
            setProcesando(false);
        }
    };

    const toggleVendido = async (id, vendidoActual) => {
        setProcesando(true);
        try {
            await updateDoc(doc(database, 'productos', id), { vendido: !vendidoActual });
        } catch (e) {
            console.error('Error al actualizar el producto', e);
        } finally {
            setProcesando(false);
        }
    };

    return { eliminarProducto, toggleVendido, procesando };
};
