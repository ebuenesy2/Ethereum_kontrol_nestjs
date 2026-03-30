/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { ServiceAccount } from 'firebase-admin';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        try {
          const serviceAccount: ServiceAccount = {
            projectId: String(process.env.FIREBASE_PROJECT_ID),
            clientEmail: String(process.env.FIREBASE_CLIENT_EMAIL),
            privateKey: String(process.env.FIREBASE_PRIVATE_KEY)?.replace(
              /\\n/g,
              '\n',
            ),
          };

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          return admin.initializeApp({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            credential: admin.credential.cert(serviceAccount),
          }) as App;
        } catch (error) {
          console.error('Error initializing Firebase Admin SDK:', error);
          throw new Error('Failed to initialize Firebase Admin SDK');
        }
      },
    },
    FirebaseService,
  ],
  exports: ['FIREBASE_ADMIN', FirebaseService],
})
export class FirebaseModule {}
