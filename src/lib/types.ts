
// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  categories: string[];
  timePreference: string;
  isActive: boolean;
}

// Affirmation Types
export interface Affirmation {
  id: string;
  text: string;
  category: string;
  createdAt: string;
  createdBy: string;
}

export interface AffirmationCategory {
  id: string;
  name: string;
  description: string;
  count: number;
}

// Log Types
export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  details?: string;
}

export interface MessageLog extends SystemLog {
  userId: string;
  affirmationId: string;
  status: 'sent' | 'failed' | 'delivered';
}
