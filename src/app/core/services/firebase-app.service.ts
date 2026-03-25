import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Functions, getFunctions } from 'firebase/functions';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseAppService {
  private readonly appInstance: FirebaseApp =
    getApps().length > 0 ? getApp() : initializeApp(environment.firebase);

  get app(): FirebaseApp {
    return this.appInstance;
  }

  get firestore(): Firestore {
    return getFirestore(this.appInstance);
  }

  get functions(): Functions {
    return getFunctions(this.appInstance, environment.firebaseBackend.functionsRegion);
  }
}
