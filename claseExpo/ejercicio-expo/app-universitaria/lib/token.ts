import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'token';

export const guardarToken = (token: string) => AsyncStorage.setItem(KEY, token);
export const obtenerToken = () => AsyncStorage.getItem(KEY);
export const borrarToken = () => AsyncStorage.removeItem(KEY);