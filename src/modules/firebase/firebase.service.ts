import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseApp: admin.app.App,
  ) {}

  async sendNotification(title: string, body: string, url?: string) {
    try {
      const result = await this.firebaseApp.messaging().send({
        token: String(process.env.FIREBASE_TOKEN), //! React cihazına gönderilecek token
        notification: {
          title: title,
          body: body,
        },
        data: {
          url: url || 'https://google.com', // 👈 tıklayınca gidecek yer
        },
      });

      return {
        success: true,
        messageId: result,
      };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
