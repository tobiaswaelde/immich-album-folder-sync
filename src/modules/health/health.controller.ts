import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthStatusDto } from './types/health-status.dto';
import { HealthStatus } from './types/health-status';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get('/')
  @ApiOperation({ summary: 'Get health status' })
  @ApiOkResponse({ description: 'Health status' })
  async getHealthStatus() {
    return new HealthStatusDto({
      status: HealthStatus.Online,
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
      description: process.env.npm_package_description,
      author: {
        name: process.env.npm_package_author_name,
        email: process.env.npm_package_author_email,
        url: process.env.npm_package_author_url,
      },
    });
  }
}
