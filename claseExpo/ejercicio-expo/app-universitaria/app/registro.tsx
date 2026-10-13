import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { registro } from '@/lib/api';

const ROLES = ['usuario', 'admin'];

export default function RegistroScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('usuario');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const registrar = async () => {
    if (nombre.trim() === '' || email.trim() === '' || password === '') {
      setError('Completa todos los campos');
      return;
    }
    setError('');
    setCargando(true);
    try {
      await registro({ nombre: nombre.trim(), email: email.trim(), password, rol });
      router.replace({ pathname: '/login', params: { registrado: '1' } });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#888"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Rol</Text>
      <View style={styles.roles}>
        {ROLES.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.rol, rol === r && styles.rolActivo]}
            onPress={() => setRol(r)}>
            <Text style={[styles.rolTexto, rol === r && styles.rolTextoActivo]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.boton, cargando && styles.botonDeshabilitado]}
        onPress={registrar}
        disabled={cargando}>
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botonTexto}>Registrarme</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#f8fafc', flexGrow: 1 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    color: '#111',
  },
  label: { color: '#0f172a', fontWeight: '600', marginBottom: 8 },
  roles: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  rol: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  rolActivo: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  rolTexto: { color: '#0f172a', fontWeight: '600' },
  rolTextoActivo: { color: '#fff' },
  error: { color: '#dc2626', marginBottom: 12 },
  boton: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  botonDeshabilitado: { opacity: 0.6 },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
});