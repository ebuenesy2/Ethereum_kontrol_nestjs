import { Body, Controller, Get } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Blockchain') //! Tag Eklendi
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get()
  @ApiOperation({
    summary: 'Ansayfa - Get',
    description: 'Verileri Getiriyor',
  })
  home() {
    return {
      title: 'Anasayfa',
      message: 'Home',
    };
  }
}
