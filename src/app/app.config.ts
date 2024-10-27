import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoute } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
} from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoute),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyCBk20I8RH96ZSP-SmkgAN1_VGolzBQwoA",
        authDomain: "belofonte-sw.firebaseapp.com",
        databaseURL: "https://belofonte-sw-default-rtdb.firebaseio.com",
        projectId: "belofonte-sw",
        storageBucket: "belofonte-sw.appspot.com",
        messagingSenderId: "149350714862",
        appId: "1:149350714862:web:c73d7f37ec7fc89ba812ff",
        measurementId: "G-QSY5PVXTLJ"
      })
    ),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    provideFirestore(() => getFirestore()),
  ],
};
