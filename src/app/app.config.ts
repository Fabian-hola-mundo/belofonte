import { ApplicationConfig, importProvidersFrom, inject, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { appRoute } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
} from '@angular/fire/analytics';
import { getFirestore, provideFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { firebaseConfig } from '../../core/constants/firebase.config';
import { isPlatformBrowser } from '@angular/common';
import {
  provideFirebaseApp,
  initializeApp,
  initializeServerApp,
} from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoute),
    provideClientHydration(),
    importProvidersFrom(HttpClientModule),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators && isPlatformBrowser(inject(PLATFORM_ID))) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      return auth;
    }),
    provideFunctions(() => getFunctions()),
    provideAnalytics(() => getAnalytics()),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators && isPlatformBrowser(inject(PLATFORM_ID))) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
  ],
};
