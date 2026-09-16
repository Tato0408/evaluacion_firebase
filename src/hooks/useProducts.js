import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../config/firebase';

/**
 * Escucha en tiempo real la colección 'productos' ordenada por fecha de creación.
 * Devuelve la lista, el estado de carga y el error si lo hubiera.
 */
export const useProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(database, 'productos'), orderBy('creado', 'desc'));

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setProductos(docs);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Error al escuchar productos', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { productos, loading, error };
};
