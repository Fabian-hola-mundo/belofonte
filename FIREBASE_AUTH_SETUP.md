# 🔥 Configuración de Firebase Auth - Belofonte

## ❌ Error: `auth/requests-from-referer-http://localhost:4200-are-blocked`

Este error ocurre cuando Firebase Auth bloquea las solicitudes desde localhost. Aquí están las soluciones:

## 🚀 Solución 1: Usar Emuladores de Firebase (Recomendado para desarrollo)

### 1. Iniciar los emuladores
```bash
# Opción A: Usar el script automatizado
./start-emulators.sh

# Opción B: Comando manual
firebase emulators:start
```

### 2. Usuario de prueba creado automáticamente
- **Email:** `admin@belofonte.com`
- **Contraseña:** `123456`

### 3. Verificar que los emuladores estén corriendo
- **Auth Emulator:** http://localhost:9099
- **Firestore Emulator:** http://localhost:8080
- **UI de Emuladores:** http://localhost:4000

## 🌐 Solución 2: Usar Firebase en Producción

### 1. Cambiar configuración en environment.ts
```typescript
export const environment = {
  production: false,
  useEmulators: false, // ← Cambiar a false
  firebaseConfig: {
    // ... configuración existente
  }
};
```

### 2. Configurar dominios autorizados en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `belofonte-sw`
3. Ve a **Authentication** > **Settings** > **Authorized domains**
4. Agrega `localhost` a la lista de dominios autorizados

### 3. Crear usuario en Firebase Console
1. Ve a **Authentication** > **Users**
2. Crea un usuario con email y contraseña

## 🔧 Verificación

### Comprobar que los emuladores están corriendo:
```bash
curl http://localhost:9099
# Debería devolver: {"authEmulator":{"ready":true,...}}
```

### Comprobar configuración actual:
- Revisa `src/environments/environment.ts`
- `useEmulators: true` = Usa emuladores locales
- `useEmulators: false` = Usa Firebase en producción

## 🐛 Troubleshooting

### Error persiste con emuladores:
1. Detener emuladores: `Ctrl+C`
2. Reiniciar: `./start-emulators.sh`
3. Verificar puerto 9099 libre: `lsof -i :9099`

### Error con Firebase en producción:
1. Verificar dominios autorizados en Firebase Console
2. Verificar que el usuario existe en Authentication
3. Verificar configuración de API keys

## 📝 Notas Importantes

- **Desarrollo:** Usar emuladores (`useEmulators: true`)
- **Producción:** Usar Firebase real (`useEmulators: false`)
- Los emuladores no persisten datos entre reinicios
- El usuario de prueba se crea automáticamente con el script
