import { Body, Controller, Post, NotFoundException } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';

// @ApiExcludeController() //! Swaggerdan Gizle
@ApiTags('Users')
@Controller('users')
@ApiSecurity('x-api-key') //! Swagger'dan Bearer Token Alıyor
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Arama (POST /user/login)
  @Post('login')
  @ApiOperation({ summary: 'Müşteri Login' })
  @ApiBody({
    description: 'Transaction oluşturma payload',
    schema: {
      example: {
        email: 'admin@admin.com',
        password: 'a!1234567891',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Müşteri Bulundu',
    schema: {
      example: {
        success: true,
        timestamp: '2025-11-07T11:13:22.341Z',
        message: 'Müşteri Bulundu',
        data: {
          title: 'Müşteri Arama',
          status: 200,
          success: true,
          time: 1762504443363,
          DB: {
            id: 4,
            name: 'ebuenes',
            surname: 'yıldırım',
            email: 'ebuenesy2@gmail.com',
            value: '100',
            isUpdated: 0,
            created_at: '2025-11-02T05:42:42.000Z',
            updated_at: null,
            deleted_at: null,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Müşteri Bulunamadı',
    schema: {
      example: {
        success: false,
        path: '/user/find/224323',
        error: 'NOT_FOUND',
        message: 'errors.not_found',
        timestamp: '2025-11-07T12:47:38.110Z',
        details: {
          message: 'errors.not_found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Sunucu hatası - Beklenmeyen bir hata oluştu.',
  })
  getUserLogin(@Body() userDto: { email: string; password: string }) {
    let status = 400;
    if (
      userDto.email == 'admin@admin.com' &&
      userDto.password == 'a!1234567891'
    ) {
      status = 200;
      console.log('Kullanıcı Giriş Oldu');

      return {
        title: 'Kullanıcı Login',
        success: status == 200 ? true : false,
        status,
        token: 'admin01',
        data: userDto,
      };
    } else {
      throw new NotFoundException(`Kullanıcı Bulunamadı`);
    }
  } // Arama (GET /user/filtre/:searchKey/:searchValue) -- Son
}
