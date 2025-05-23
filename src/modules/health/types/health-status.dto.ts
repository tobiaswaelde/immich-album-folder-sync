import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HealthStatus } from './health-status';
import { Expose } from 'class-transformer';

export class HealthStatusDto {
  @ApiProperty()
  @Expose()
  status: HealthStatus;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  version: string;

  @ApiPropertyOptional()
  @Expose()
  description: string;

  @ApiPropertyOptional({
    type: 'object',
    properties: {
      name: { type: 'string', required: false },
      email: { type: 'string', required: false },
      url: { type: 'string', required: false },
    },
  })
  @Expose()
  author?: {
    name?: string;
    email?: string;
    url?: string;
  };

  constructor(partial: Partial<HealthStatusDto>) {
    Object.assign(this, partial);
  }
}
