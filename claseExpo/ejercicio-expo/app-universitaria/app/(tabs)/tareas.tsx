import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ApiError, getTareas, type Tarea } from '@/lib/api';
import { borrarToken, obtenerToken } from '@/lib/token';

export default function TareasScreen() {
  const router = useRouter();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cerrarSesion = useCallback(async () => {
    await borrarToken();
    router.replace('/login');
  }, [router]);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const token = await obtenerToken();
      if (!token) {
        router.replace('/login');
        return;
      }
      const data = await getTareas(token);
      setTareas(data);
    } catch (e) {
      
      if (e instanceof ApiError && e.status === 401) {
        await cerrarSesion();
        return;
      }
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally {
      setCargando(false);
    }
  }, [router, cerrarSesion]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Mis tareas</Text>
        <TouchableOpacity style={styles.botonSalir} onPress={cerrarSesion}>
          <Text style={styles.botonSalirTexto}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 40 }} />
      ) : error !== '' ? (
        <View style={styles.centro}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.botonReintentar} onPress={cargar}>
            <Text style={styles.botonReintentarTexto}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tareas}
          keyExtractor={(item) => String(item.id)}
          refreshing={cargando}
          onRefresh={cargar}
          ListEmptyComponent={<Text style={styles.vacio}>No tienes tareas todavía.</Text>}
          renderItem={({ item }) => (
            <View style={[styles.item, item.completada && styles.itemCompletada]}>
              <Text style={styles.tituloTarea}>{item.titulo}</Text>
              <Text style={styles.estado}>
                {item.completada ? 'Completada' : 'Pendiente'} ·{' '}
                {new Date(item.creadoEn).toLocaleDateString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  botonSalir: { backgroundColor: '#dc2626', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  botonSalirTexto: { color: '#fff', fontWeight: '600' },
  centro: { alignItems: 'center', marginTop: 40 },
  error: { color: '#dc2626', marginBottom: 12, textAlign: 'center' },
  botonReintentar: { backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },
  botonReintentarTexto: { color: '#fff', fontWeight: '600' },
  vacio: { textAlign: 'center', color: '#64748b', marginTop: 40 },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#f59e0b',
  },
  itemCompletada: { borderLeftColor: '#16a34a' },
  tituloTarea: { fontSize: 17, fontWeight: '600', color: '#0f172a' },
  estado: { color: '#64748b', marginTop: 4 },
});