import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoute } from './app.routes';
import { initializeApp, provideFirebaseApp, getApp, FirebaseOptions, FirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';

const firebaseConfig: FirebaseOptions = {
  projectId: 'belofonte-sw',
  appId: '1:149350714862:web:c73d7f37ec7fc89ba812ff',
  databaseURL: 'https://belofonte-sw-default-rtdb.firebaseio.com',
  storageBucket: 'belofonte-sw.appspot.com',
  apiKey: 'AIzaSyCBk20I8RH96ZSP-SmkgAN1_VGolzBQwoA',
  authDomain: 'belofonte-sw.firebaseapp.com',
  messagingSenderId: '149350714862',
  measurementId: 'G-QSY5PVXTLJ',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoute),
    provideHttpClient(),
    provideAnimations(),
    provideClientHydration(),
    importProvidersFrom(
      provideFirebaseApp(() => {
        try {
          return getApp();
        } catch (error) {
          return initializeApp({
            apiKey: "AIzaSyCBk20I8RH96ZSP-SmkgAN1_VGolzBQwoA",
            authDomain: "belofonte-sw.firebaseapp.com",
            databaseURL: "https://belofonte-sw-default-rtdb.firebaseio.com",
            projectId: "belofonte-sw",
            storageBucket: "belofonte-sw.appspot.com",
            messagingSenderId: "149350714862",
            appId: "1:149350714862:web:c73d7f37ec7fc89ba812ff",
            measurementId: "G-QSY5PVXTLJ"
          });
        }
      }),
      provideFirestore(() => getFirestore()),
      provideDatabase(() => getDatabase()),
    ),
  ],
};
