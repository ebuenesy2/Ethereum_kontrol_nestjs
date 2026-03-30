import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Headers,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import * as express from 'express'; //! Express

import { RabbitService } from '../rabbit/rabbit.service'; //! Rabbit MQ
import { RabbitEnum } from '../../common/enum/rabbit-action'; //! Rabbit Enum

import { Logger } from 'nestjs-pino'; //! Logger Pino
import { LogActivityService } from '../log_activities/log_activities.service'; // Log

import { TransactionService } from './transaction.service';
import { TransactionDto } from '../../common/dto/transaction.dto'; //!  TransactionCreateDto
import { TransactionEntity } from '../../common/entities/transaction.entity';

@ApiTags('Transaction Management') //! Swagger Tag
@Controller('transaction')
@ApiSecurity('x-api-key') //! Swagger'dan Bearer Token Alıyor
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly rabbit: RabbitService,
    private readonly logger: Logger,
    private readonly logActivityService: LogActivityService, //! Log
  ) {}

  //! Tüm Veriler
  @Get()
  @ApiOperation({
    summary: 'İşlem listesi',
    description:
      'Sistemde kayıtlı tüm işlemleri sayfalama ve sıralama seçenekleriyle birlikte listeler.',
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
    description: 'İşlem listesi başarıyla getirildi.',
  })
  @ApiResponse({
    status: 500,
    description: 'Sunucu hatası - Beklenmeyen bir hata oluştu.',
  })
  async getAllTransaction(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return await this.transactionService.dbFindAll_Transaction(
      Number(page),
      Number(limit),
      order,
    ); //! Tüm Veriler
  } //! Tüm Veriler -- Son

  // Arama (GET /transaction/find/:searchKey/:searchValue)
  @Get('find/:searchKey/:searchValue')
  @ApiOperation({
    summary: 'İşlem sorgulama',
    description:
      'Belirtilen alan ve değere göre tek bir işlem kaydını getirir.',
  })
  @ApiParam({
    name: 'searchKey',
    example: 'jobId',
    description: 'Sorgulama yapılacak alan adı (örnek: jobId, transactionId)',
  })
  @ApiParam({
    name: 'searchValue',
    example: 'abc-123',
    description: 'Aranacak değer',
  })
  @ApiResponse({
    status: 200,
    description: 'İşlem başarıyla bulundu.',
  })
  @ApiResponse({
    status: 404,
    description: 'Belirtilen kriterlere uygun işlem bulunamadı.',
  })
  @ApiResponse({
    status: 500,
    description: 'Sunucu hatası - Beklenmeyen bir hata oluştu.',
  })
  async getTransactionById(
    @Param('searchKey') searchKey: string,
    @Param('searchValue') searchValue: string,
  ): Promise<TransactionEntity> {
    return await this.transactionService.dbFind_Transaction(
      searchKey,
      searchValue,
    ); //! Servis Gönderiyor
  } // Arama (GET /transaction/find/:searchKey/:searchValue) -- Son

  // Arama (GET /transaction/filtre/:searchKey/:searchValue)
  @Get('filtre/:searchKey/:searchValue')
  @ApiOperation({
    summary: 'Transaction filtreleme',
    description: `
      Belirtilen alan (searchKey) ve değere (searchValue) göre transaction kayıtlarını filtreler.

      Örnek:
      - status = completed
      - email = test@test.com
    `,
  })
  @ApiParam({
    name: 'searchKey',
    example: 'status',
    description: 'Filtrelenecek alan adı (örn: status, email, user_id)',
  })
  @ApiParam({
    name: 'searchValue',
    example: 'completed',
    description: 'Filtrelenecek değer',
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
    description: 'Transaction listesi başarıyla getirildi',
    schema: {
      example: {
        success: true,
        message: 'Transaction listesi getirildi',
        data: {
          items: [
            {
              id: 4,
              email: 'example@mail.com',
              value: '100',
              status: 'completed',
              created_at: '2025-11-02T05:42:42.000Z',
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 100,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Geçersiz parametre',
  })
  @ApiResponse({
    status: 404,
    description: 'Kayıt bulunamadı',
  })
  @ApiResponse({
    status: 500,
    description: 'Sunucu hatası - Beklenmeyen bir hata oluştu.',
  })
  async getTransactionFiltre(
    @Param('searchKey') searchKey: string,
    @Param('searchValue') searchValue: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return await this.transactionService.dbFiltreleme_Transaction(
      searchKey,
      searchValue,
      page,
      limit,
      order,
    ); //! Servis Gönderiyor
  } // Arama (GET /transaction/filtre/:searchKey/:searchValue) -- Son

  // Arama (GET /transaction/filtre_status/:status/:statusJob)
  @Get('filtre_status/:status/:statusJob')
  @ApiOperation({
    summary: 'Status ve Job’a göre filtreleme',
    description: `
      Transaction kayıtlarını hem status hem de statusJob alanına göre filtreler.

      Örnek:
      - status: completed
      - statusJob: add_customer
    `,
  })
  @ApiParam({
    name: 'status',
    example: 'completed',
    description: 'Transaction durumu',
  })
  @ApiParam({
    name: 'statusJob',
    example: 'add_transaction',
    description: 'İşlem tipi (job)',
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
    description: 'Filtrelenmiş transaction listesi',
  })
  @ApiResponse({ status: 404, description: 'Kayıt bulunamadı' })
  @ApiResponse({
    status: 500,
    description: 'Sunucu hatası - Beklenmeyen bir hata oluştu.',
  })
  async getTransactionFiltreStatus(
    @Param('status') status: string,
    @Param('statusJob') statusJob: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return await this.transactionService.dbFiltre_Status_Transaction(
      status,
      statusJob,
      page,
      limit,
      order,
    ); //! Servis Gönderiyor
  } // Arama (GET /transaction/filtre_status/:status/:statusJob) -- Son

  @Post('add')
  @ApiOperation({
    summary: 'Transaction oluştur ',
    description: ` Yeni bir transaction oluşturur `,
  })
  @ApiHeader({
    name: 'user-agent',
    description: 'İsteği yapan client bilgisi',
    required: false,
    schema: {
      type: 'string',
      default: 'Swagger',
    },
  })
  @ApiBody({
    description: 'Transaction oluşturma payload',
    schema: {
      example: {
        created_byId: 20, //! Veriyi Gönderen Kişi

        type: 'tl_yatır', //! tl_yatır
        type_dbid: 11,

        transactionId: '', //! İşlem Id
        transactionDate: '2026-03-17T13:12:59Z', //! Zamanı
        transactionIPAddress: '192.168.1.10', //! Ip Adres

        customer_number: '20',
        transaction_type: 'tl_yatır', //! tl_yatır - tl_cek - kripto_yatır - kripto_cek

        amount: 1500, //! İşlemin ana tutarıdır.
        sendAmount: 1500, //! Gönderenin çıkan para miktarı
        receiveAmount: 1500, //! Alıcının aldığı miktar

        fee: 0, // Komisyon
        description: 'TL Yatırma', // Açıklama
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction eklendi',
    schema: {
      example: {
        success: true,
        message: 'Transaction eklendi',
        jobId: 'uuid-123',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Geçersiz istek',
  })
  @ApiResponse({
    status: 500,
    description: 'Sunucu hatası - Beklenmeyen bir hata oluştu.',
  })
  async addTransaction(
    @Body() transactionDto: TransactionDto,
    @Req() req: express.Request,
    @Headers('user-agent') userAgent: string,
  ) {
    //console.log('transactionDto:', transactionDto);

    //! Log
    const ip = req.ip ?? '0.0.0.0';
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    //! Transaction Id
    const jobUuid = uuidv4();

    if (transactionDto.transactionId == '') {
      transactionDto.transactionId =
        transactionDto.transaction_type + '-' + jobUuid;
    } //! Transaction Id -- Son

    //! Transaction Kontrol
    transactionDto.jobId = jobUuid; //! Job Id
    transactionDto.status = 'queued'; //! Message Durumu
    transactionDto.statusJob = RabbitEnum.ADD_TRANSACTION; //! Message Durumu Görevi
    transactionDto.requestedTime = new Date().getTime();
    transactionDto.requestedAt = new Date().toLocaleString('tr-TR', {
      timeZone: 'Europe/Istanbul',
    });
    //! Transaction Kontrol -- Son
    //console.log('transactionDto: - Son', transactionDto);

    //! DB Kayıt
    const dbAdd = await this.transactionService.dbAdd_Transaction(
      transactionDto,
      ip,
      userAgent,
      fullUrl,
    ); //! DB Kayıt -- Son

    //! Kayıt Başarılı
    if (dbAdd.success) {
      this.logger.log(
        `[transaction] - [addTransactionTransaction] - Transaction Verisi Eklendi.`,
        { data: transactionDto },
      ); // Log

      await this.logActivityService.log(
        Number(transactionDto.created_byId), // user_id
        'transaction',
        String(transactionDto.type),
        'worker',
        Number(transactionDto.type_dbid),
        'Transaction Verisi Eklendi - jobUuid: ' + jobUuid, // subject
        fullUrl, // url
        'POST', // method
        ip, // register sırasında alınan IP
        userAgent, // agent
        JSON.stringify({
          status: transactionDto.status,
          statusJob: transactionDto.statusJob,
          requestedTime: transactionDto.requestedTime,
          requestedAt: transactionDto.requestedAt,

          jobId: jobUuid,
        }),
      ); //! Log Son

      // //! Transaction Gönderiyor
      // await this.rabbit.publish(
      //   RabbitEnum.ADD_TRANSACTION,
      //   transactionDto,
      //   ip,
      //   userAgent,
      //   fullUrl,
      // );

      return {
        title: 'Transaction Ekle',
        status: 200,
        success: true,
        message: 'Transaction Verisi Eklendi - jobId:' + jobUuid,
        data: transactionDto,
      };
    } else {
      return {
        title: 'Transaction Ekle',
        status: 500,
        success: false,
        message: 'Transaction ekleme sırasında bir hata oluştu.',
        data: transactionDto,
      };
    }
  } // Transaction - Ekle -- Son

  @Post('edit/:jobIdValue')
  @ApiOperation({
    summary: 'Transaction Güncelleme',
    description: `
    🔹 Transaction queue sistemine gönderilir  
    🔹 RabbitMQ üzerinden async işlenir  
    🔹 Status otomatik olarak "queued" olur  
    🔹 jobId ile takip edilebilir  
    `,
  })
  @ApiHeader({
    name: 'user-agent',
    description: 'İsteği yapan client bilgisi',
    required: false,
    schema: {
      type: 'string',
      default: 'Swagger',
    },
  })
  @ApiParam({
    name: 'jobIdValue',
    example: 'cbe5a7ee-2dc8-4837-91ed-dd125b6ee472',
    description: 'Güncellenecek kaydı bulmak için kullanılacak alan',
    required: true,
  })
  @ApiBody({
    description: 'Transaction oluşturma payload',
    schema: {
      example: {
        created_byId: 100, //! Veriyi Gönderen Kişi

        //"transactionDate": "2026-03-07T13:12:59Z", //! Zamanı
        //"transactionIPAddress": "192.168.1.10", //! Ip Adres
        //"transactionCountry": "TR",

        //"customer_number": "107",
        //"transaction_type": "tl_yatır", //! tl_yatır - tl_cek - kripto_yatır - kripto_cek

        amount: 1600, //! İşlemin ana tutarıdır.
        sendAmount: 1600, //! Gönderenin çıkan para miktarı
        receiveAmount: 1600, //! Alıcının aldığı miktar

        fee: 0, // Komisyon
        description: 'TL Yatırma', // Açıklama
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction başarıyla güncellendi',
    schema: {
      example: {
        title: 'Transaction Güncelle',
        status: 200,
        success: true,
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction bulunamadı',
  })
  @ApiResponse({
    status: 500,
    description: 'Sunucu hatası - Beklenmeyen bir hata oluştu.',
  })
  async editTransaction(
    @Param('jobIdValue') jobIdValue: string,
    @Body() transactionDto: TransactionDto,
    @Req() req: express.Request,
    @Headers('user-agent') userAgent: string,
  ) {
    //! Log
    const ip = req.ip ?? '0.0.0.0';
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    //! Transaction Kontrol
    transactionDto.status = 'queued'; //! Message Durumu
    transactionDto.statusJob = RabbitEnum.EDIT_TRANSACTION; //! Message Durumu Görevi
    transactionDto.requestedTime = new Date().getTime();
    transactionDto.requestedAt = new Date().toLocaleString('tr-TR', {
      timeZone: 'Europe/Istanbul',
    });
    //! Transaction Kontrol -- Son

    //! Detay Bilgileri String Yapıyor
    const transaction_optionalParameters = JSON.stringify(
      transactionDto.optionalParameters,
    ); //! Profil Bilgileri String Yapıyor

    delete transactionDto.optionalParameters; //! Detay Sil
    transactionDto.detail = transaction_optionalParameters; //! Detail Ekle

    //! Kayıt Güncelle
    const result_db = await this.transactionService.dbEdit_Transaction(
      jobIdValue,
      transactionDto,
      ip,
      userAgent,
      fullUrl,
    ); //! Servis Gönderiyor
    console.log('result_db:', result_db);

    //! Kayıt Başarılı
    if (result_db.status == 200) {
      transactionDto.jobId = result_db?.jobId || '';
    }
    //! Kayıt Güncelle -- Son

    //! Transaction Gönderiyor
    transactionDto.id = Number(result_db?.data?.id);
    transactionDto.created_byId = Number(result_db?.data?.created_byId);
    transactionDto.type = String(result_db?.data?.type);
    transactionDto.type_dbid = Number(result_db?.data?.type_dbid);
    await this.rabbit.publish(
      RabbitEnum.EDIT_TRANSACTION,
      transactionDto,
      ip,
      userAgent,
      fullUrl,
    );

    this.logger.log(
      `[transaction] - [editTransactionTransaction] - Transaction Verisi Güncellendi.`,
      { data: transactionDto },
    ); // Log

    await this.logActivityService.log(
      Number(transactionDto.created_byId), // user_id
      'transaction',
      String(transactionDto.type),
      'worker',
      Number(transactionDto.type_dbid),
      'Transaction Verisi Güncellendi - jobId: ' + result_db.jobId, // subject
      fullUrl, // url
      'POST', // method
      ip, // register sırasında alınan IP
      userAgent, // agent
      JSON.stringify({
        jobId: transactionDto.jobId || null,

        status: transactionDto.status,
        statusJob: transactionDto.statusJob,
        requestedTime: transactionDto.requestedTime,
        requestedAt: transactionDto.requestedAt,
      }),
    ); //! Log Son

    return {
      title: 'Transaction Güncelle',
      status: 200,
      success: true,
      message: 'Transaction Verisi Güncellendi - jobId:' + result_db.jobId,
      data: transactionDto,
    };
  } // Transaction - Güncelle -- Son

  // Arama (GET /transaction/delete/:jobIdValue)
  @Post('delete/:jobIdValue')
  @ApiOperation({
    summary: 'Transaction Silme',
    description: `
    🔹 Transaction queue sistemine gönderilir  
    🔹 RabbitMQ üzerinden async işlenir  
    🔹 Status otomatik olarak "queued" olur  
    🔹 jobId ile takip edilebilir  
    `,
  })
  @ApiHeader({
    name: 'user-agent',
    description: 'İsteği yapan client bilgisi',
    required: false,
    schema: {
      type: 'string',
      default: 'Swagger',
    },
  })
  @ApiParam({
    name: 'jobIdValue',
    description: 'Güncellenecek kaydı bulmak için kullanılacak alan',
    required: true,
    schema: {
      type: 'string',
      default: '09d4418a-1944-4a32-824e-0f239474ee9d',
    },
  })
  @ApiBody({
    schema: {
      example: {
        created_byId: 100,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction başarıyla silindi',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction bulunamadı',
  })
  @ApiResponse({
    status: 500,
    description: 'Sunucu hatası - Beklenmeyen bir hata oluştu.',
  })
  async deleteTransaction(
    @Param('jobIdValue') jobIdValue: string,
    @Body() transactionDto: TransactionDto,
    @Req() req: express.Request,
    @Headers('user-agent') userAgent: string,
  ) {
    //! Log
    const ip = req.ip ?? '0.0.0.0';
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    //! Transaction Kontrol
    transactionDto.status = 'queued'; //! Message Durumu
    transactionDto.statusJob = RabbitEnum.DELETE_TRANSACTION; //! Message Durumu Görevi
    transactionDto.requestedTime = new Date().getTime();
    transactionDto.requestedAt = new Date().toLocaleString('tr-TR', {
      timeZone: 'Europe/Istanbul',
    });
    //! Transaction Kontrol -- Son

    //! Kayıt Güncelle
    const result_db = await this.transactionService.dbEdit_Transaction(
      jobIdValue,
      transactionDto,
      ip,
      userAgent,
      fullUrl,
    ); //! Servis Gönderiyor
    //return result_db;

    //! Kayıt Başarılı
    if (result_db.status == 200) {
      transactionDto.jobId = result_db?.jobId || '';
    }
    //! Kayıt Başarılı -- Son

    //! Transaction Gönderiyor
    transactionDto.id = Number(result_db?.data?.id);
    transactionDto.created_byId = Number(result_db?.data?.created_byId);
    transactionDto.type = String(result_db?.data?.type);
    transactionDto.type_dbid = Number(result_db?.data?.type_dbid);
    await this.rabbit.publish(
      RabbitEnum.DELETE_TRANSACTION,
      transactionDto,
      ip,
      userAgent,
      fullUrl,
    );

    this.logger.log(
      `[transaction] - [deleteTransactionTransaction] - Transaction Silindi.`,
      { data: transactionDto },
    ); // Log

    await this.logActivityService.log(
      Number(transactionDto.created_byId), // user_id
      'transaction',
      String(transactionDto.type),
      'worker',
      Number(transactionDto.type_dbid),
      'Transaction Silindi - jobId: ' + result_db.jobId, // subject
      fullUrl, // url
      'POST', // method
      ip, // register sırasında alınan IP
      userAgent, // agent
      JSON.stringify({
        jobId: transactionDto.jobId || null,

        status: transactionDto.status,
        statusJob: transactionDto.statusJob,
        requestedTime: transactionDto.requestedTime,
        requestedAt: transactionDto.requestedAt,
      }),
    ); //! Log Son

    return {
      title: 'Transaction Sil',
      status: 200,
      success: true,
      message:
        'Transaction Silindi - transactionId:' +
        (transactionDto.transactionId || jobIdValue),
      data: transactionDto,
    };
  } // Transaction - Sil -- Son
}
