import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
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
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoute),
    /* provideClientHydration(), */
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp(
        environment.firebaseConfig
      )
    ),
    provideFunctions(() => getFunctions()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    provideFirestore(() => getFirestore()),
  ],
};
