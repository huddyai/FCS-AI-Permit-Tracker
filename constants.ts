import { Permit, Condition, Status, RiskLevel, Milestone, Evidence } from './types';

export const MOCK_PERMITS: Permit[] = [
  {
    id: 'P-101',
    project: 'Vista Grande Development',
    name: 'Air Quality Construction Permit',
    jurisdiction: 'Bay Area AQMD',
    type: 'Construction',
    effectiveDate: '2023-01-15',
    expirationDate: '2025-01-15',
    owner: 'Sarah Jenkins',
    status: Status.ON_TRACK,
    description: 'Permit authorizing construction equipment operation.',
    documentName: 'AQMD_Construction_Auth_2023.pdf'
  },
  {
    id: 'P-102',
    project: 'Riverside Industrial Park',
    name: 'NPDES General Permit',
    jurisdiction: 'State Water Board',
    type: 'Water Quality',
    effectiveDate: '2023-06-01',
    expirationDate: '2024-06-01',
    owner: 'Mike Ross',
    status: Status.AT_RISK,
    description: 'Stormwater discharge compliance.',
    documentName: 'NPDES_General_Permit_Order_2023.pdf'
  },
  {
    id: 'P-103',
    project: 'Solar Farm Alpha',
    name: 'Endangered Species Incidental Take',
    jurisdiction: 'US Fish & Wildlife',
    type: 'Biological',
    effectiveDate: '2022-11-01',
    expirationDate: '2025-11-01',
    owner: 'Sarah Jenkins',
    status: Status.COMPLIANT,
    description: 'Mitigation measures for desert tortoise habitat.',
    documentName: 'USFWS_Incidental_Take_Permit.pdf'
  },
  {
    id: 'P-104',
    project: 'Downtown Mixed Use',
    name: 'Noise Variance Permit',
    jurisdiction: 'City Planning Dept',
    type: 'Noise',
    effectiveDate: '2024-02-01',
    expirationDate: '2024-08-01',
    owner: 'David Chen',
    status: Status.OVERDUE,
    description: 'Allowance for night-time concrete pouring.',
    documentName: 'City_Noise_Variance_Approved.pdf'
  }
];

export const MOCK_CONDITIONS: Condition[] = [
  {
    id: 'C-101-A',
    permitId: 'P-101',
    description: 'Submit quarterly emissions report',
    dueDate: '2024-04-15',
    status: Status.ON_TRACK,
    riskLevel: RiskLevel.LOW,
    evidenceRequired: true,
    evidenceUploaded: true,
    owner: 'Sarah Jenkins'
  },
  {
    id: 'C-101-B',
    permitId: 'P-101',
    description: 'Install particulate matter sensors',
    dueDate: '2024-05-01',
    status: Status.AT_RISK,
    riskLevel: RiskLevel.MEDIUM,
    evidenceRequired: true,
    evidenceUploaded: false,
    owner: 'Sarah Jenkins'
  },
  {
    id: 'C-102-A',
    permitId: 'P-102',
    description: 'Conduct wet weather sampling',
    dueDate: '2024-03-30',
    status: Status.OVERDUE,
    riskLevel: RiskLevel.HIGH,
    evidenceRequired: true,
    evidenceUploaded: false,
    owner: 'Mike Ross'
  },
  {
    id: 'C-103-A',
    permitId: 'P-103',
    description: 'Annual biological survey',
    dueDate: '2024-10-01',
    status: Status.PENDING,
    riskLevel: RiskLevel.MEDIUM,
    evidenceRequired: true,
    evidenceUploaded: false,
    owner: 'Sarah Jenkins'
  }
];

export const MOCK_EVIDENCE: Evidence[] = [
  {
    id: 'E-001',
    conditionId: 'C-101-A',
    fileName: 'Q1_2024_Emissions_Report.pdf',
    uploadedBy: 'Sarah Jenkins',
    uploadDate: '2024-04-10',
    tags: ['report', 'air-quality']
  }
];

export const MOCK_MILESTONES: Milestone[] = [
  {
    id: 'M-1',
    permitId: 'P-101',
    name: 'Initial Site Inspection',
    dueDate: '2023-02-01',
    status: Status.COMPLIANT
  },
  {
    id: 'M-2',
    permitId: 'P-102',
    name: 'SWPPP Plan Approval',
    dueDate: '2023-05-15',
    status: Status.COMPLIANT
  }
];