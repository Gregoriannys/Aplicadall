import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { login } from '@/lib/api';
import { guardarToken } from '@/lib/token';

export default function LoginScreen() {
  const router = useRouter();
  const { registrado } = useLocalSearchParams<{ registrado?: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const entrar = async () => {
    if (email.trim() === '' || password === '') {
      setError('Completa email y contraseña');
      return;
    }
    setError('');
    setCargando(true);
    try {
      const { token } = await login(email.trim(), password);
      await guardarToken(token);
      router.replace('/two');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bienvenido</Text>

      {registrado === '1' && (
        <Text style={styles.exito}>Cuenta creada. Ahora inicia sesión.</Text>
      )}

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

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.boton, cargando && styles.botonDeshabilitado]}
        onPress={entrar}
        disabled={cargando}>
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botonTexto}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/registro')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f8fafc' },
  titulo: { fontSize: 30, fontWeight: 'bold', color: '#0f172a', marginBottom: 24 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    color: '#111',
  },
  error: { color: '#dc2626', marginBottom: 12 },
  exito: { color: '#16a34a', marginBottom: 12 },
  boton: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  botonDeshabilitado: { opacity: 0.6 },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: '#2563eb', textAlign: 'center', marginTop: 16 },
});