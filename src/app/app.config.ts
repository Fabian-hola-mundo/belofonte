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
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { firebaseConfig } from '../../core/constants/firebase.config';
import { isPlatformBrowser } from '@angular/common';
import {
  provideFirebaseApp,
  initializeApp,
  initializeServerApp,
} from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoute),
    provideClientHydration(),
    importProvidersFrom(HttpClientModule),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions()),
    provideAnalytics(() => getAnalytics()),
    provideFirestore(() => getFirestore()),
  ],
};
