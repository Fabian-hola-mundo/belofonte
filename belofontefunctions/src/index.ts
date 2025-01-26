/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
import * as crypto from 'crypto';

// Función HTTP para generar el hash de integridad
export const generateIntegrityHash = functions.https.onRequest((req, res) => {
  // Habilitar CORS si es necesario
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");

  // Manejo de las solicitudes preflight
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }

  try {
    const { reference, amount, currency, expiration } = req.body;

    // Asegúrate de validar los datos recibidos
    if (!reference || !amount || !currency || !expiration) {
      res.status(400).json({ error: "Faltan parámetros necesarios." });
      return;
    }

    // Tu clave de integridad (nunca debe exponerse en el cliente)
    const integrityKey = "test_integrity_6PPJu8LcFTB7UgWkbb9CBd4U9WBaYNXG";

    // Generar el hash concatenando los valores en el orden correcto
    const dataToHash = `${reference}${amount}${currency}${expiration}${integrityKey}`;
    const hash = crypto.createHmac("sha256", integrityKey).update(dataToHash).digest("hex");

    // Devolver el hash generado
    res.status(200).json({ integrityHash: hash });
  } catch (error) {
    console.error("Error generando el hash:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
