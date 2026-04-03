import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

export const tokenCache = {
  async getToken(key: string) {
    try {
      if (Platform.OS === 'web') {
        return null
      }
      return await SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      if (Platform.OS === 'web') {
        return
      }
      return await SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}
