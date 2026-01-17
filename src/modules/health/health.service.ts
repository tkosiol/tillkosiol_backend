import { Injectable, Inject } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@/db/database.module';
import { HealthCheckResponse, HealthStatus } from './health.types';

@Injectable()
export class HealthService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  check(): HealthCheckResponse {
    return {
      status: HealthStatus.OK,
      timestamp: new Date().toISOString(),
      service: 'tillkosiol-backend',
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  async checkDatabase(): Promise<HealthCheckResponse> {
    const baseResponse = this.check();

    try {
      // Simple query to check database connection
      await this.db.execute(sql`SELECT 1`);

      return {
        ...baseResponse,
        database: {
          status: HealthStatus.OK,
          message: 'Connected to PostgreSQL',
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        ...baseResponse,
        status: HealthStatus.ERROR,
        database: {
          status: HealthStatus.ERROR,
          message: `Database connection failed: ${errorMessage}`,
        },
      };
    }
  }
}
