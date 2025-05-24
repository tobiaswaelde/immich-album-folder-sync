import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SyncResultDto {
  @ApiProperty()
  @IsNumber()
  success: number;

  @ApiProperty()
  @IsNumber()
  failed: number;

  constructor(partial: Partial<SyncResultDto>) {
    Object.assign(this, partial);
  }
}
