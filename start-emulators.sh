#!/bin/bash

echo "🚀 Iniciando emuladores de Firebase..."
echo ""

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI no está instalado. Instálalo con:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Crear usuario de prueba si no existe
echo "👤 Creando usuario de prueba admin@belofonte.com..."
firebase emulators:exec --only auth "curl -X POST 'http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key' -H 'Content-Type: application/json' -d '{\"email\":\"admin@belofonte.com\",\"password\":\"123456\",\"returnSecureToken\":true}' > /dev/null 2>&1" 2>/dev/null || true

echo ""
echo "🔥 Iniciando emuladores de Firebase..."
echo "📧 Usuario de prueba: admin@belofonte.com"
echo "🔑 Contraseña: 123456"
echo "🌐 UI de emuladores: http://localhost:4000"
echo ""

firebase emulators:start
