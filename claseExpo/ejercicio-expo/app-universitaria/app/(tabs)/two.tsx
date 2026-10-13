import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>ESTUDIANTE</Text>
        <Text style={styles.nombre}>Gregoriannys</Text>
        <Text style={styles.matricula}>Matricula: 2023-0742</Text>
      </View>

      <TouchableOpacity style={styles.boton} onPress={() => router.push('/materias')}>
        <Text style={styles.botonTexto}>Ver mis materias</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f8fafc' },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderLeftWidth: 6,
    borderLeftColor: '#10b981',
  },
  etiqueta: { fontSize: 12, fontWeight: 'bold', color: '#10b981', marginBottom: 6 },
  nombre: { fontSize: 26, fontWeight: 'bold', color: '#0f172a' },
  matricula: { fontSize: 16, color: '#64748b', marginTop: 4 },
  boton: { backgroundColor: '#10b981', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
});