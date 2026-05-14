export interface Incident {
  id: number;
  type: 'flood' | 'earthquake' | 'cyclone' | 'landslide' | 'fire' | 'other';
  lat: number;
  lng: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'active' | 'resolved';
  reporter: string;
  description: string;
  timestamp?: string;
}

export interface SOSSignal {
  userId: string;
  userName: string;
  lat: number;
  lng: number;
  message?: string;
  timestamp?: string;
}
