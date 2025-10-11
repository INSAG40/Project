export interface Rule {
  id?: string;
  name: string;
  description: string;
  category: 'behavioral' | 'pattern' | 'frequency' | 'threshold';
  field: string;
  operator: string;
  value: string;
  risk_points: number;
  active: boolean;
  created_at?: string;
}
