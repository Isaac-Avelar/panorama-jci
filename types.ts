
export type Region = 'US' | 'BR';
export type UserStatus = 'PENDING' | 'APPROVED' | 'BLOCKED';
export type UserRole = 'USER' | 'ADMIN';

export interface UserAccount {
  username: string;
  password: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
}

export interface IndicatorData {
  id: string;
  name: string;
  region: Region;
  unit: string;
  description: string;
  currentValue: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  isInverse: boolean;
}

export interface MonthlyRecord {
  month: string;
  prevYear: number | null;
  currYear: number | null;
}

export interface AutomationStep {
  id: number;
  title: string;
  tool: string;
  description: string;
  prompt: string;
}
