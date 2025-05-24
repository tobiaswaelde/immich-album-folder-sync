import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncModule } from './modules/sync/sync.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // custom modules
    HealthModule,
    SyncModule,
  ],
})
export class AppModule {}
