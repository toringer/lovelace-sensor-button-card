import { ActionConfig } from 'custom-card-helpers';

// TODO Add your configuration elements here for type-checking
export interface SensorButtonCardConfig {
  type: string;
  name?: string;
  entity: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  precision: number;
  below?: Limit;
  above?: Limit;
}

export interface Limit {
  limit: number;
  color: string;
}
