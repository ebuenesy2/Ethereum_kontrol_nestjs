import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendNotificationDto } from '../../common/dto/firebase.dto';

@ApiTags('Firebase Notification') //! Tag
@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('send')
  @ApiOperation({
    summary: 'Bildirim Gönder',
    description: 'FCM token ile kullanıcıya push notification gönderir',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: '🚀 Test Bildirimi',
        },
        message: {
          type: 'string',
          example: 'Firebase çalışıyor!',
        },
      },
      required: ['token', 'title', 'message'],
    },
  })
  async sendNotification(@Body() body: SendNotificationDto) {
    const { title, message } = body;

    const result = await this.firebaseService.sendNotification(title, message);

    return {
      success: true,
      message: 'Bildirim gönderildi',
      firebase_response: result,
      payload: body,
    };
  }
}
