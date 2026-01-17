import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthCheckResponse } from './health.types';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health Check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  check(): HealthCheckResponse {
    return this.healthService.check();
  }

  @Get('db')
  @ApiOperation({ summary: 'Database Health Check' })
  @ApiResponse({ status: 200, description: 'Database is connected' })
  @ApiResponse({ status: 503, description: 'Database is not connected' })
  async checkDatabase(): Promise<HealthCheckResponse> {
    return this.healthService.checkDatabase();
  }
}
