import { Controller, Get, Param, Query } from '@nestjs/common';
import { LogActivityService } from './log_activities.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Log Management')
@ApiSecurity('x-api-key') //! Swagger'dan Bearer Token Alıyor
@Controller('logs')
export class LogActivityController {
  constructor(private readonly logActivityService: LogActivityService) {}

  //! Tüm Veriler
  @Get()
  @ApiOperation({
    summary: 'Log kayıtlarını listele',
    description:
      'Sistemde bulunan tüm log kayıtlarını sayfalama ve sıralama seçenekleri ile birlikte getirir.',
  })
  @ApiQuery({
    name: 'page',
    required: true, //! Zorunluluk
    description: 'Sayfa numarası',
    schema: {
      type: 'integer',
      example: 1,
      minimum: 1,
    },
  })
  @ApiQuery({
    name: 'limit',
    required: true, //! Zorunluluk
    description: 'Sayfa başına kayıt sayısı',
    schema: {
      type: 'integer',
      example: 10,
      minimum: 1,
    },
  })
  @ApiQuery({
    name: 'order',
    required: true,
    enum: ['ASC', 'DESC'],
    example: 'DESC',
    description: 'Sıralama yönü',
  })
  @ApiResponse({
    status: 200,
    description: 'Log kayıtları başarıyla listelendi.',
  })
  @ApiResponse({
    status: 500,
    description: 'Log kayıtları listelenirken beklenmeyen bir hata oluştu.',
  })
  async getAllLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return await this.logActivityService.findAll(
      Number(page),
      Number(limit),
      order,
    ); //! Tüm Veriler
  } //! Tüm Veriler -- Son

  // Arama (GET /logs/find/:id)
  @Get('find/user/:userId')
  @ApiOperation({
    summary: 'Kullanıcıya ait log kayıtlarını getir',
    description:
      'Belirtilen kullanıcı ID’sine ait tüm log kayıtlarını getirir.',
  })
  @ApiParam({
    name: 'userId',
    example: 100,
    description: 'Logları getirilecek kullanıcının ID değeri',
  })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcıya ait log kayıtları başarıyla getirildi.',
  })
  @ApiResponse({
    status: 404,
    description: 'Belirtilen kullanıcıya ait log kaydı bulunamadı.',
  })
  @ApiResponse({
    status: 500,
    description: 'Log kayıtları getirilirken hata oluştu.',
  })
  async getLogsByUserId(@Param('userId') userId: number) {
    return await this.logActivityService.dbFindUser(userId); //! Servis Gönderiyor
  } // Arama (GET /logs/find/:id) -- Son

  // Arama (GET /logs/find/:id)
  @Get('find/:id')
  @ApiOperation({
    summary: 'Log kaydı detayını getir',
    description:
      'Belirtilen ID değerine sahip log kaydının detay bilgilerini getirir.',
  })
  @ApiParam({
    name: 'id',
    example: 224,
    description: 'Getirilmek istenen log kaydının ID değeri',
  })
  @ApiResponse({
    status: 200,
    description: 'Log kaydı başarıyla getirildi.',
  })
  @ApiResponse({
    status: 404,
    description: 'Belirtilen ID ile log kaydı bulunamadı.',
  })
  @ApiResponse({
    status: 500,
    description: 'Log kaydı getirilirken hata oluştu.',
  })
  async getLogById(@Param('id') id: number) {
    return await this.logActivityService.dbFind(id); //! Servis Gönderiyor
  } // Arama (GET /logs/find/:id) -- Son

  // Arama (GET /logs/delete/:id)
  @Get('delete/:id')
  @ApiOperation({
    summary: 'Log kaydını sil',
    description:
      'Belirtilen ID değerine sahip log kaydını sistemden kalıcı olarak siler.',
  })
  @ApiParam({
    name: 'id',
    example: 224,
    description: 'Silinecek log kaydının ID değeri',
  })
  @ApiResponse({
    status: 200,
    description: 'Log kaydı başarıyla silindi.',
  })
  @ApiResponse({
    status: 404,
    description: 'Silinmek istenen log kaydı bulunamadı.',
  })
  @ApiResponse({
    status: 500,
    description: 'Silme işlemi sırasında hata oluştu.',
  })
  async deleteLogById(@Param('id') id: number) {
    return await this.logActivityService.dbDelete(id); //! Servis Gönderiyor
  } // Arama (GET /logs/find/:id) -- Son
}
