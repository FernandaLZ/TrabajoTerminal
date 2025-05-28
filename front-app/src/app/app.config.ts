import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch} from "@angular/common/http";
import {provideNativeDateAdapter} from "@angular/material/core";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../environments/environments";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {FIREBASE_OPTIONS} from "@angular/fire/compat";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideNativeDateAdapter(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
  ],
};
