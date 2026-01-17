export enum HealthStatus {
  OK = 'ok',
  ERROR = 'error',
}

export interface HealthCheckResponse {
  status: HealthStatus;
  timestamp: string;
  service: string;
  version: string;
  database?: {
    status: HealthStatus;
    message: string;
  };
}
