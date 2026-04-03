import { ethers } from 'ethers';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

import { v4 as uuidv4 } from 'uuid'; //! UUID
import { RabbitEnum } from '../../common/enum/rabbit-action'; //! Rabbit Enum

import { TransactionDto } from '../../common/dto/transaction.dto'; //!  TransactionCreateDto
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class BlockchainService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly transactionService: TransactionService,
  ) {}
  private provider: ethers.JsonRpcProvider | undefined;
  private contract: ethers.Contract | undefined;

  onModuleInit() {
    const rpcUrl = process.env.ALCHEMY_URL;

    if (!rpcUrl) {
      throw new Error('ALCHEMY_URL tanımlı değil');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    const abi = [
      'event Transfer(address indexed from, address indexed to, uint256 value)',
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.contract = new ethers.Contract(
      '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
      abi,
      this.provider,
    );

    console.log('🚀 Blockchain dinleniyor...');
    this.listenTransfers();
  }

  private listenTransfers(): void {
    if (!this.contract) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    void this.contract.on(
      'Transfer',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (from, to, value, event: ethers.EventLog) => {
        try {
          console.log('Yeni Transfer Olayı Algılandı Value:', value);

          //! 10 USDT = 10,000,000 (USDT 6 decimal place)
          const amount = Number(value) / 1_000_000; // USDT decimals

          //! Transaction Kaydet
          if (amount >= 100000) {
            const jobUuid = uuidv4();

            const transactionDto: TransactionDto = {
              jobId: jobUuid, //! Job Id
              status: 'queued', //! Message Durumu
              statusJob: RabbitEnum.ADD_TRANSACTION, //! Message Durumu Görevi
              requestedTime: new Date().getTime(), //! İstek Zamanı
              requestedAt: new Date().toLocaleString('tr-TR', {
                timeZone: 'Europe/Istanbul',
              }), //! İstek Zamanı (Türkiye Saati)

              created_byId: 2, //! Veriyi Gönderen Kişi

              type: 'usdt', //! tl_yatır
              type_dbid: 11,

              transactionId: 'blockchain-' + new Date().getTime(), //! Benzersiz Transaction ID
              transactionDate: '2026-03-24T13:12:59Z', //! Zamanı
              transactionIPAddress: '192.168.1.10', //! Ip Adres

              transaction_type: 'USDT Transfer',

              customer_number: '2',

              amount: amount.toString(), //! İşlemin ana tutarıdır.
              sendAmount: amount.toString(), //! Gönderenin çıkan para miktarı
              receiveAmount: amount.toString(), //! Alıcının aldığı miktar

              fee: '', // Komisyon
              description: `USDT transferi - From: ${from}, To: ${to}`,
            };
            console.log('transactionDto: - Son', transactionDto);

            const dbAdd = await this.transactionService.dbAdd_Transaction(
              transactionDto,
              '0.0.0', // ip
              'BlockchainScanner/1.0', // userAgent
              'url', // full
            ); //! DB Kayıt -- Son
            if (dbAdd.success) {
              console.log('Transaction Veritabanına Kaydedildi:', dbAdd.data);
            } else {
              console.error(
                'Transaction Veritabanına Kaydedilemedi:',
                dbAdd.message,
              );
            }
          }
          //! Transaction Kaydet -- Son

          //! Bildirim Gönder
          if (amount >= 100000) {
            // 1000000 USDT = 1,000,000.00 USDT
            console.log('Büyük Transfer Gerçekleştirildi:', amount);

            await this.firebaseService.sendNotification(
              'Büyük USDT Transferi Gerçekleşti',
              `${amount} USDT transfer edildi - From: ${from}, To: ${to}`,
            );
          }
          //! Bildirim Gönder -- Son

          console.log('Yeni Transfer Olayı:');
          console.log('event:', event); // Olay detaylarını logla

          console.log('----------------------------');
          console.log('📤 From:', from);
          console.log('📥 To:', to);
          console.log('💰 Amount:', amount, 'USDT');
          //console.log('🔗 TxHash:', event.log.transactionHash);
          console.log('----------------------------');
        } catch (error) {
          console.error('Hata:', error);
        }
      },
    );
  }

  onModuleDestroy() {
    if (this.contract) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      this.contract.removeAllListeners();
    }
  }
}
