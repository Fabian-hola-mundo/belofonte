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

exports.generateSignature = functions.https.onCall((data, context) => {
  const integrity = functions.config().wompi.integrity; // Obtén la clave
  console.log('Integrity key:', integrity); // Muestra la clave de integridad en la consola

  const { reference, amount_in_cents, currency, expiration_time } = data;

  // Crea la cadena de firma
  const signatureString = `${reference}${amount_in_cents}${currency}${expiration_time}${integrity}`;
  const hash = crypto.createHash('sha256').update(signatureString).digest('hex');
  console.log(integrity)

  return { signature: hash };

});

exports.getIntegrityKey = functions.https.onCall((data, context) => {
  const integrity = functions.config().wompi.integrity;
  return { integrity };
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
