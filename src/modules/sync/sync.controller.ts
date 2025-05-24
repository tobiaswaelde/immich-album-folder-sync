import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { SyncResultDto } from '../../types/sync/sync-result.dto';

@ApiTags('sync')
@Controller('sync')
export class SyncController {
  constructor(@Inject(SyncService.token) private readonly syncService: SyncService) {}

  @ApiOperation({ summary: 'Sync now' })
  @ApiOkResponse({ description: 'Sync result', type: SyncResultDto })
  @Get('/sync-now')
  async syncNow() {
    return this.syncService.syncNow();
  }
}
