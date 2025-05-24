import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';

@Module({
  providers: [{ provide: SyncService.token, useClass: SyncService }],
  controllers: [SyncController],
})
export class SyncModule {}
