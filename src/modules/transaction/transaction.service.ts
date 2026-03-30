//! transaction.service.ts
import { Logger } from 'nestjs-pino'; //! Logger Pino
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsWhere, Like } from 'typeorm';

import { RabbitEnum } from '../../common/enum/rabbit-action'; //! Rabbit Enum
import { RabbitService } from '../rabbit/rabbit.service'; //! Rabbit MQ

import { TransactionDto } from '../../common/dto/transaction.dto'; //!  TransactionCreateDto
import { TransactionEntity } from '../../common/entities/transaction.entity'; //! TransactionEntity
import { LogActivityService } from '../log_activities/log_activities.service'; // Log

import { CustomerGateway } from '../socket/customer.gateway'; //! Socket

//! Service
export interface ServiceResult<T = unknown> {
  title?: string;
  status: number;
  success: boolean;
  message: string;
  time: number;
  id?: number;
  customer_number?: string;
  data?: T; // Burada Entity'yi response içine gömebilirsin

  jobId?: string;
}

@Injectable()
export class TransactionService {
  constructor(
    private readonly logger: Logger,
    private readonly customerGateway: CustomerGateway,
    private readonly rabbit: RabbitService,

    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
    private readonly logActivityService: LogActivityService, //! Log
  ) {}

  //! --------- Transaction ---------------

  //! Tüm Veriler - Transaction
  async dbFindAll_Transaction(
    page: number = 1,
    limit: number = 10,
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    //! Sayfalandırma
    const offset = (page - 1) * limit;
    //const data = await this.transactionRepo.find({  order: { id: 'DESC' }}); //! ID'ye göre sırala

    //! Transaction Arama
    const [dbFind, total] = await this.transactionRepo.findAndCount({
      order: { id: order },
      skip: offset,
      take: limit,
    });

    if (dbFind.length < 1) {
      throw new NotFoundException('Veri Bulunamadı');
    }

    const totalPages = Math.ceil(total / limit); //! Toplam Sayfa Sayısı

    return {
      title: 'Tüm Veriler',
      status: dbFind.length > 0 ? 200 : 404,
      success: dbFind.length > 0 ? true : false,
      message:
        dbFind.length > 0 ? 'Veriler Listelendi' : 'Transaction Bulunamadı',
      time: new Date().getTime(),

      //id:dbFind[0]?.id,
      rows: dbFind,

      meta: {
        total, // Filtreye uyan toplam kayıt
        size: dbFind.length, // Bu sayfadaki kayıt sayısı
        page, // Şu anki sayfa
        perPage: limit, // Sayfa başına kayıt limiti
        pageCount: totalPages, // Toplam sayfa sayısı
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
        sort: {
          field: 'id',
          direction: order,
        },
        appliedFilters: {
          page,
          limit,
        },
      },
    };
  } //! Tüm Veriler -- Transaction Son

  //! Transaction Arama - Transaction
  async dbFind_Transaction(
    searchKey: string,
    searchValue: string,
  ): Promise<TransactionEntity> {
    // DB’de Transaction arama
    const dbFind = await this.transactionRepo.findOne({
      where: { [searchKey]: searchValue },
    });

    if (!dbFind) {
      this.logger.error(
        `[dbFind_Transaction] - Transaction Bulunamadı ${searchKey} : ${searchValue}`,
      );
      throw new NotFoundException(
        `Transaction Bulunamadı ${searchKey}: ${searchValue}`,
      );
    }

    this.logger.log(
      `[dbFind_Transaction] - Transaction Bulundu ${searchKey} : ${searchValue}`,
    );

    // Eğer frontend veya controller string/Date dönüşümü istiyorsa burada map edebilirsin
    // Örnek: requestedTime number → ISO string
    const mappedResult: TransactionEntity = {
      ...dbFind,
      requestedTime: dbFind.requestedTime ?? null,
      requestedAt: dbFind.requestedAt ?? null,
    };

    return mappedResult;
  } //! Transaction Arama - Transaction -- Son

  //! Transaction Filtreleme - Transaction
  async dbFiltreleme_Transaction(
    searchKey: string,
    searchValue: string,
    page: number = 1,
    limit: number = 10,
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    //! Sayfalandırma
    const offset = (page - 1) * limit;
    //const data = await this.transactionRepo.find({  order: { id: 'DESC' }}); //! ID'ye göre sırala

    //! Dinamik Where
    let whereCondition: FindOptionsWhere<TransactionEntity>;

    // Numeric alan kontrolü
    if (['id', 'totalScore'].includes(searchKey)) {
      whereCondition = { [searchKey]: Number(searchValue) };
    } else {
      // String alanlar LIKE araması
      whereCondition = { [searchKey]: Like(`%${searchValue}%`) };
    }

    //! Transaction Arama
    const [dbFind, total] = await this.transactionRepo.findAndCount({
      where: whereCondition,
      order: { id: order },
      //order: { timestamp: 'DESC' },
      skip: offset,
      take: limit,
    });

    if (dbFind.length < 1) {
      throw new NotFoundException('Veri Bulunamadı');
    }

    const totalPages = Math.ceil(total / limit); //! Toplam Sayfa Sayısı

    return {
      title: 'Veri Filtreleme',
      status: dbFind.length > 0 ? 200 : 404,
      success: dbFind.length > 0 ? true : false,
      message:
        dbFind.length > 0 ? 'Veriler Listelendi' : 'Transaction Bulunamadı',
      time: new Date().getTime(),

      //id:dbFind[0]?.id,
      rows: dbFind,

      meta: {
        total, // Filtreye uyan toplam kayıt
        size: dbFind.length, // Bu sayfadaki kayıt sayısı
        page, // Şu anki sayfa
        perPage: limit, // Sayfa başına kayıt limiti
        pageCount: totalPages, // Toplam sayfa sayısı
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
        sort: {
          field: 'id',
          direction: order,
        },
        appliedFilters: {
          page,
          limit,
        },
      },
    };
  } //! Transaction Filtreleme - Transaction Son

  //! Transaction Filtre - Status - Transaction
  async dbFiltre_Status_Transaction(
    status: string,
    statusJob: string,
    page: number = 1,
    limit: number = 10,
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    //! Sayfalandırma
    const offset = (page - 1) * limit;
    //const data = await this.transactionRepo.find({  order: { id: 'DESC' }}); //! ID'ye göre sırala

    //! Dinamik Where

    //! Transaction Arama
    const where: FindOptionsWhere<TransactionEntity> = {};

    if (status !== undefined) {
      where.status = status;
    }

    if (statusJob !== undefined) {
      where.statusJob = statusJob as RabbitEnum;
    }

    const [dbFind, total] = await this.transactionRepo.findAndCount({
      where,
      order: {
        id: order === 'ASC' ? 'ASC' : 'DESC',
      },
      skip: offset,
      take: limit,
    });

    if (dbFind.length < 1) {
      throw new NotFoundException('Veri Bulunamadı');
    }

    const totalPages = Math.ceil(total / limit); //! Toplam Sayfa Sayısı

    return {
      title: 'Veri Filtreleme',
      status: dbFind.length > 0 ? 200 : 404,
      success: dbFind.length > 0 ? true : false,
      message:
        dbFind.length > 0 ? 'Veriler Listelendi' : 'Transaction Bulunamadı',
      time: new Date().getTime(),

      //id:dbFind[0]?.id,
      rows: dbFind,

      meta: {
        total, // Filtreye uyan toplam kayıt
        size: dbFind.length, // Bu sayfadaki kayıt sayısı
        page, // Şu anki sayfa
        perPage: limit, // Sayfa başına kayıt limiti
        pageCount: totalPages, // Toplam sayfa sayısı
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
        sort: {
          field: 'id',
          direction: order,
        },
        appliedFilters: {
          page,
          limit,
        },
      },
    };
  } //! Transaction Filtre - Status - Transaction Son

  //! Transaction Ekleme - Transaction
  async dbAdd_Transaction(
    transactionCreateDto: TransactionDto,
    ip: string,
    userAgent: string,
    fullUrl: string,
  ): Promise<ServiceResult<TransactionEntity>> {
    //console.log('transactionCreateDto:', transactionCreateDto);

    const transaction_optionalParameters = JSON.stringify(
      transactionCreateDto.optionalParameters,
    ); //! Profil Bilgileri String Yapıyor

    delete transactionCreateDto.optionalParameters; //! Profil Sil
    transactionCreateDto.detail = transaction_optionalParameters; //! Detail Ekle

    const dbAdd = this.transactionRepo.create(transactionCreateDto); // DTO'dan yeni Transaction oluştur
    const DbAdd_Save = await this.transactionRepo.save(dbAdd); // Veritabanına kaydet

    //! Kayıt Başarılı
    if (DbAdd_Save) {
      //this.customerGateway.emitTransactionAdd({ id: 1 });
      this.customerGateway.emitTransactionAdd(DbAdd_Save);

      this.logger.log('Transaction Verisi Eklendi', {
        id: Number(DbAdd_Save['id']),
      });

      //! Log Ekle
      await this.logActivityService.log(
        Number(transactionCreateDto.created_byId),
        'transaction',
        String(transactionCreateDto.type),
        'create',
        Number(transactionCreateDto.type_dbid),
        'Transaction transactionCreateDto Oluşturuldu', // subject
        fullUrl, // url
        'POST', // method
        ip, // register sırasında alınan IP
        userAgent, // agent
        JSON.stringify({
          status: transactionCreateDto.status,
          statusJob: transactionCreateDto.statusJob,
          requestedTime: transactionCreateDto.requestedTime,
          requestedAt: transactionCreateDto.requestedAt,

          jobId: Number(transactionCreateDto.jobId),
          id: Number(DbAdd_Save['id']),
        }),
      ); //! Log Ekle -- Son
    } //! Kayıt Başarılı -- Son
    else {
      this.logger.error('Transaction Verisi Eklenemedi', {
        transactionCreateDto,
      });
    }

    return {
      title: 'Transaction Ekleme',
      status: DbAdd_Save ? 201 : 400,
      success: DbAdd_Save ? true : false,
      message: DbAdd_Save ? 'Transaction Eklendi' : 'Transaction Eklenemedi',
      time: new Date().getTime(),
      id: Number(DbAdd_Save['id']),

      //DbAdd_save:DbAdd_Save
      //dto:dto_Response
    };
  } //! Transaction Ekleme - Transaction -- Son

  //! Transaction Güncelle - Transaction
  async dbEdit_Transaction(
    jobIdValue: string,
    transactionDto: TransactionDto,
    ip: string,
    userAgent: string,
    fullUrl: string,
  ): Promise<ServiceResult<TransactionEntity>> {
    //! Transaction Arama
    const dbFind = await this.transactionRepo.findOne({
      where: { jobId: jobIdValue },
    });
    if (!dbFind) {
      throw new NotFoundException('Veri Bulunamadı: ' + `jobId: ${jobIdValue}`);
    }

    // Güncelleme tarihini manuel olarak DTO'ya ekleme
    const updatePayload: DeepPartial<TransactionEntity> = {
      ...transactionDto,
      isUpdated: 1,
      updated_at: new Date(),
    };

    // Merge ve kaydet
    const updatedDB = this.transactionRepo.merge(dbFind, updatePayload);
    const DbUpdate_Save = await this.transactionRepo.save(updatedDB);
    if (!DbUpdate_Save) {
      this.logger.error(
        `[transaction] - [dbEdit_Transaction] - Transaction Güncellenemedi jobId : ${jobIdValue}`,
      );
      throw new NotFoundException(
        `Transaction Güncellenemedi jobId: ${jobIdValue}`,
      );
    }

    console.log('Güncellenen Transaction:', updatedDB);

    this.customerGateway.emitTransactionUpdate(updatedDB);

    this.logger.log(
      `[transaction] - [dbEdit_Transaction] - Veri Güncellendi jobId : ${jobIdValue}`,
    );

    //! Log Ekle
    await this.logActivityService.log(
      Number(dbFind.created_byId), // user_id
      'transaction',
      String(dbFind.type),
      'edit',
      Number(dbFind.type_dbid),
      'Transaction Verisi Güncellendi', // subject
      fullUrl, // url
      'POST', // method
      ip, // register sırasında alınan IP
      userAgent, // agent
      JSON.stringify({
        ...updatePayload,
      }),
    ); //! Log Ekle -- Son

    return {
      title: 'Transaction Güncelleme',
      status: 200,
      success: true,
      time: new Date().getTime(),
      message: 'Transaction Güncellendi',
      jobId: dbFind.jobId,
      data: dbFind,
    };
  } //! Transaction Güncelle - Transaction -- Son

  //! Transaction Silme - Transaction
  async dbDelete_Transaction(
    jobIdValue: string,
    ip: string,
    userAgent: string,
    fullUrl: string,
  ): Promise<ServiceResult<TransactionEntity>> {
    //! Transaction Arama
    const dbFind = await this.transactionRepo.findOne({
      where: { jobId: jobIdValue },
    }); //! Transaction Arama
    if (!dbFind) {
      throw new NotFoundException('Veri Bulunamadı');
    }

    //! Sil
    const deleteResult = await this.transactionRepo.delete(dbFind.id);
    let status = 1;

    // Etkilenen satır sayısını kontrol et
    if (deleteResult.affected === 0) {
      status = 0;
    }

    //! Log Ekle
    if (deleteResult.affected != 0) {
      this.logger.log('Transaction Verisi Silindi', { id: Number(dbFind.id) });

      this.customerGateway.emitTransactionDelete({ id: Number(dbFind.id) }); //! Socket Gönder

      await this.logActivityService.log(
        Number(dbFind.created_byId), // user_id
        'transaction',
        String(dbFind.type),
        'delete',
        Number(dbFind.type_dbid),
        'Transaction Kaydı Silindi', // subject
        fullUrl, // url
        'POST', // method
        ip, // register sırasında alınan IP
        userAgent, // agent
        JSON.stringify({
          id: dbFind.id,
        }),
      );
    } //! Log Ekle -- Son

    return {
      title: 'Transaction Silme',
      status: status ? 200 : 404,
      success: status ? true : false,
      message: status ? 'Transaction Silindi' : 'Transaction Silinemedi',
      time: new Date().getTime(),
      id: dbFind.id,
    };
  } //! Transaction Silme - Transaction -- Son
}
