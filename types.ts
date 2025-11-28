export enum Status {
  ON_TRACK = 'On Track',
  AT_RISK = 'At Risk',
  OVERDUE = 'Overdue',
  COMPLIANT = 'Compliant',
  PENDING = 'Pending'
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  avatarUrl: string;
  notifications: {
    email: boolean;
    push: boolean;
    digest: boolean;
  };
}

export interface Permit {
  id: string;
  project: string;
  name: string;
  jurisdiction: string;
  type: string;
  effectiveDate: string;
  expirationDate: string;
  owner: string;
  status: Status;
  description?: string;
  documentUrl?: string;
  documentName?: string;
}

export interface Condition {
  id: string;
  permitId: string;
  description: string;
  dueDate: string;
  status: Status;
  riskLevel: RiskLevel;
  evidenceRequired: boolean;
  evidenceUploaded: boolean;
  owner: string;
}

export interface Evidence {
  id: string;
  conditionId: string;
  fileName: string;
  uploadedBy: string;
  uploadDate: string;
  tags: string[];
}

export interface Milestone {
  id: string;
  permitId: string;
  name: string;
  dueDate: string;
  status: Status;
}