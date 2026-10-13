import { View, Text, FlatList, StyleSheet } from 'react-native';

const MATERIAS = [
  { id: '1', nombre: 'Programacion Aplicada II' },
  { id: '2', nombre: 'Etica para Ingenieros en Sistemas' },
  { id: '3', nombre: 'Sistemas Operativos' },
  { id: '4', nombre: 'Organizacion y Administracion de Sistemas' },
  { id: '5', nombre: 'Ingenieria economica' },
];

export default function MateriasScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={MATERIAS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 20, backgroundColor: '#f8fafc' },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#7c3aed',
  },
  nombre: { fontSize: 17, fontWeight: '600', color: '#0f172a' },
  
});