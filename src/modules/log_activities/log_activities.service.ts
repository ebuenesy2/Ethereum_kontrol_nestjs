import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogActivityEntity } from '../../common/entities/log_activity.entity';

@Injectable()
export class LogActivityService {
  constructor(
    @InjectRepository(LogActivityEntity)
    private readonly logActivityRepository: Repository<LogActivityEntity>,
  ) {}

  //! Tüm Veriler
  async findAll(
    page: number = 1,
    limit: number = 10,
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    //! Sayfalandırma
    const offset = (page - 1) * limit;
    //const data = await this.logActivityRepository.find({  order: { id: 'DESC' }}); //! ID'ye göre sırala

    //! Veri Arama
    const [dbFind, total] = await this.logActivityRepository.findAndCount({
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
      message: dbFind.length > 0 ? 'Veriler Listelendi' : 'Veri Bulunamadı',
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
          direction: 'DESC',
        },
        appliedFilters: {
          page,
          limit,
        },
      },
    };
  } //! Tüm Veriler -- Son

  //! Veri Arama
  async dbFind(id: number) {
    const dbFind = await this.logActivityRepository.findOne({
      where: { id: id },
    }); //! Veri Arama
    if (!dbFind) {
      throw new NotFoundException('Veri Bulunamadı');
    }

    return {
      title: 'Veri Arama',
      status: dbFind ? 200 : 404,
      success: dbFind ? true : false,
      message: dbFind ? 'Veri Bulundu' : 'Veri Bulunamadı',
      time: new Date().getTime(),

      //id:dbFind[0]?.id,
      DB: dbFind,
    };
  } //! Veri Arama -- Son

  //! Veri Arama
  async dbFindUser(userId: number) {
    const dbFind = await this.logActivityRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
    if (dbFind.length < 1) {
      throw new NotFoundException('Veri Bulunamadı');
    }

    return {
      title: 'Veri Arama',
      status: dbFind.length > 0 ? 200 : 404,
      success: dbFind.length > 0 ? true : false,
      message: dbFind.length > 0 ? 'Veri Bulundu' : 'Veri Bulunamadı',
      time: new Date().getTime(),

      //id:dbFind[0]?.id,
      DB: dbFind,
    };
  } //! Veri Arama -- Son

  //! Veri Silme
  async dbDelete(id: number) {
    const dbFind = await this.logActivityRepository.findOne({
      where: { id: id },
    }); //! Veri Arama
    if (!dbFind) {
      throw new NotFoundException('Veri Bulunamadı');
    }

    //! Sil
    const deleteResult = await this.logActivityRepository.delete(id);
    let status = 1;

    // Etkilenen satır sayısını kontrol et
    if (deleteResult.affected === 0) {
      status = 0;
    }

    return {
      title: 'Veri Silme',
      status: status ? 200 : 404,
      success: status ? true : false,
      message: status ? 'Veri Silindi' : 'Veri Silinemedi',
      time: new Date().getTime(),
      id: id,
    };
  } //! Veri Silme -- Son

  // Yeni log ekleme
  async log(
    userId: number,
    category: string,
    entity: string,
    action: string,
    db_id: number,
    subject: string,
    url?: string,
    method?: string,
    ip?: string,
    agent?: string,
    details?: string,
  ): Promise<LogActivityEntity> {
    const newLog = this.logActivityRepository.create({
      user_id: userId,
      category,
      entity,
      action,
      db_id,
      subject,
      url,
      method,
      ip,
      agent,
      details,
    });
    return this.logActivityRepository.save(newLog);
  }
  // Yeni log ekleme -- Son
}
