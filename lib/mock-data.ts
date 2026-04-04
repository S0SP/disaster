// Mock data for SAHAYATA - Decentralized Disaster Relief Governance Platform

export interface Campaign {
  id: string
  title: string
  description: string
  location: string
  disasterType: string
  targetAmount: number
  raisedAmount: number
  progressPercentage: number
  status: 'active' | 'funded' | 'completed' | 'closed'
  image: string
  createdAt: string
  endDate: string
  ngoId: string
  ngoName: string
  beneficiaries: number
  fundAllocation: {
    shelter: number
    water: number
    food: number
    medical: number
    other: number
  }
}

export interface Donation {
  id: string
  donorId: string
  campaignId: string
  amount: number
  timestamp: string
  txHash: string
  status: 'confirmed' | 'pending' | 'failed'
}

export interface ProofSubmission {
  id: string
  campaignId: string
  ngoId: string
  title: string
  description: string
  amount: number
  location: string
  latitude: number
  longitude: number
  imageHash: string
  videoHash: string
  timestamp: string
  status: 'pending' | 'verified' | 'rejected'
  milestoneIndex: number
  beneficiariesAffected: number
}

export interface Vote {
  id: string
  proposalId: string
  voterId: string
  support: 'yes' | 'no' | 'abstain'
  timestamp: string
  votingPower: number
}

export interface Proposal {
  id: string
  campaignId: string
  proofSubmissionId: string
  description: string
  requestedAmount: number
  status: 'pending' | 'approved' | 'rejected' | 'executed'
  votingStart: string
  votingEnd: string
  yesVotes: number
  noVotes: number
  abstainVotes: number
  quorumRequired: number
  quorumMet: boolean
  executionDate?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'donor' | 'ngo' | 'voter' | 'admin'
  walletAddress: string
  avatar: string
  joinedDate: string
}

export interface AuditLog {
  id: string
  timestamp: string
  action: string
  actor: string
  details: string
  severity: 'info' | 'warning' | 'error'
}

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-001',
    title: 'Monsoon Relief - Kerala Flooding 2024',
    description: 'Emergency relief for families affected by massive flooding in Kerala. Funds will be used for emergency shelter, clean water, food supplies, and medical aid.',
    location: 'Kerala, India',
    disasterType: 'Flooding',
    targetAmount: 500000,
    raisedAmount: 387420,
    progressPercentage: 77,
    status: 'active',
    image: '/campaigns/kerala-flood.jpg',
    createdAt: '2024-07-01',
    endDate: '2024-12-31',
    ngoId: 'ngo-001',
    ngoName: 'International Disaster Relief Foundation',
    beneficiaries: 15000,
    fundAllocation: {
      shelter: 35,
      water: 25,
      food: 25,
      medical: 10,
      other: 5,
    },
  },
  {
    id: 'camp-002',
    title: 'Earthquake Recovery - Turkey',
    description: 'Rebuilding homes and community infrastructure after the devastating earthquake.',
    location: 'Istanbul, Turkey',
    disasterType: 'Earthquake',
    targetAmount: 1200000,
    raisedAmount: 956300,
    progressPercentage: 80,
    status: 'active',
    image: '/campaigns/turkey-earthquake.jpg',
    createdAt: '2024-02-15',
    endDate: '2024-08-15',
    ngoId: 'ngo-002',
    ngoName: 'Global Humanitarian Response',
    beneficiaries: 25000,
    fundAllocation: {
      shelter: 45,
      water: 15,
      food: 20,
      medical: 15,
      other: 5,
    },
  },
  {
    id: 'camp-003',
    title: 'Drought Relief - Somalia',
    description: 'Providing water, food, and medical aid to communities affected by severe drought.',
    location: 'Mogadishu, Somalia',
    disasterType: 'Drought',
    targetAmount: 300000,
    raisedAmount: 245600,
    progressPercentage: 82,
    status: 'active',
    image: '/campaigns/somalia-drought.jpg',
    createdAt: '2024-01-10',
    endDate: '2024-07-10',
    ngoId: 'ngo-003',
    ngoName: 'United Crisis Response Team',
    beneficiaries: 8000,
    fundAllocation: {
      shelter: 20,
      water: 40,
      food: 30,
      medical: 5,
      other: 5,
    },
  },
  {
    id: 'camp-004',
    title: 'Wildfire Recovery - California',
    description: 'Support for families and communities impacted by California wildfires.',
    location: 'Northern California, USA',
    disasterType: 'Wildfire',
    targetAmount: 800000,
    raisedAmount: 800000,
    progressPercentage: 100,
    status: 'funded',
    image: '/campaigns/california-wildfire.jpg',
    createdAt: '2024-06-01',
    endDate: '2024-12-01',
    ngoId: 'ngo-004',
    ngoName: 'Community Recovery Alliance',
    beneficiaries: 12000,
    fundAllocation: {
      shelter: 50,
      water: 10,
      food: 15,
      medical: 15,
      other: 10,
    },
  },
]

// Mock Donations
export const mockDonations: Donation[] = [
  {
    id: 'don-001',
    donorId: 'user-001',
    campaignId: 'camp-001',
    amount: 5000,
    timestamp: '2024-11-15T10:30:00Z',
    txHash: '0x1234567890abcdef...',
    status: 'confirmed',
  },
  {
    id: 'don-002',
    donorId: 'user-002',
    campaignId: 'camp-001',
    amount: 10000,
    timestamp: '2024-11-14T15:45:00Z',
    txHash: '0x2234567890abcdef...',
    status: 'confirmed',
  },
  {
    id: 'don-003',
    donorId: 'user-003',
    campaignId: 'camp-002',
    amount: 25000,
    timestamp: '2024-11-13T09:20:00Z',
    txHash: '0x3234567890abcdef...',
    status: 'confirmed',
  },
  {
    id: 'don-004',
    donorId: 'user-001',
    campaignId: 'camp-002',
    amount: 15000,
    timestamp: '2024-11-12T14:15:00Z',
    txHash: '0x4234567890abcdef...',
    status: 'confirmed',
  },
]

// Mock Proof Submissions
export const mockProofSubmissions: ProofSubmission[] = [
  {
    id: 'proof-001',
    campaignId: 'camp-001',
    ngoId: 'ngo-001',
    title: 'Temporary Shelter Construction - Phase 1',
    description: 'Successfully constructed temporary shelters for 500 families in affected areas',
    amount: 50000,
    location: 'Kottayam District, Kerala',
    latitude: 9.5941,
    longitude: 76.5214,
    imageHash: 'QmXxxx...001',
    videoHash: 'QmYyyy...001',
    timestamp: '2024-11-10T08:00:00Z',
    status: 'verified',
    milestoneIndex: 0,
    beneficiariesAffected: 500,
  },
  {
    id: 'proof-002',
    campaignId: 'camp-001',
    ngoId: 'ngo-001',
    title: 'Clean Water Distribution',
    description: 'Distributed 10,000 liters of clean water to 2,000 beneficiaries',
    amount: 20000,
    location: 'Ernakulam District, Kerala',
    latitude: 9.9312,
    longitude: 76.2673,
    imageHash: 'QmXxxx...002',
    videoHash: 'QmYyyy...002',
    timestamp: '2024-11-08T10:30:00Z',
    status: 'verified',
    milestoneIndex: 1,
    beneficiariesAffected: 2000,
  },
  {
    id: 'proof-003',
    campaignId: 'camp-002',
    ngoId: 'ngo-002',
    title: 'Medical Camp Established',
    description: 'Set up medical camps providing free healthcare to 5,000 people',
    amount: 35000,
    location: 'Istanbul Metropolitan Area',
    latitude: 41.0082,
    longitude: 28.9784,
    imageHash: 'QmXxxx...003',
    videoHash: 'QmYyyy...003',
    timestamp: '2024-11-09T12:00:00Z',
    status: 'verified',
    milestoneIndex: 0,
    beneficiariesAffected: 5000,
  },
  {
    id: 'proof-004',
    campaignId: 'camp-003',
    ngoId: 'ngo-003',
    title: 'Food Distribution Program',
    description: 'Distributed emergency food packages to 3,000 families',
    amount: 25000,
    location: 'Mogadishu, Somalia',
    latitude: 2.0469,
    longitude: 45.3182,
    imageHash: 'QmXxxx...004',
    videoHash: 'QmYyyy...004',
    timestamp: '2024-11-07T09:15:00Z',
    status: 'pending',
    milestoneIndex: 0,
    beneficiariesAffected: 3000,
  },
]

// Mock Proposals
export const mockProposals: Proposal[] = [
  {
    id: 'prop-001',
    campaignId: 'camp-001',
    proofSubmissionId: 'proof-001',
    description: 'Release funds for Temporary Shelter Construction - Phase 1',
    requestedAmount: 50000,
    status: 'approved',
    votingStart: '2024-11-08T00:00:00Z',
    votingEnd: '2024-11-10T23:59:59Z',
    yesVotes: 342,
    noVotes: 18,
    abstainVotes: 5,
    quorumRequired: 200,
    quorumMet: true,
    executionDate: '2024-11-11T00:00:00Z',
  },
  {
    id: 'prop-002',
    campaignId: 'camp-001',
    proofSubmissionId: 'proof-002',
    description: 'Release funds for Clean Water Distribution',
    requestedAmount: 20000,
    status: 'approved',
    votingStart: '2024-11-06T00:00:00Z',
    votingEnd: '2024-11-08T23:59:59Z',
    yesVotes: 298,
    noVotes: 12,
    abstainVotes: 3,
    quorumRequired: 200,
    quorumMet: true,
    executionDate: '2024-11-09T00:00:00Z',
  },
  {
    id: 'prop-003',
    campaignId: 'camp-003',
    proofSubmissionId: 'proof-004',
    description: 'Release funds for Food Distribution Program',
    requestedAmount: 25000,
    status: 'pending',
    votingStart: '2024-11-09T00:00:00Z',
    votingEnd: '2024-11-12T23:59:59Z',
    yesVotes: 156,
    noVotes: 8,
    abstainVotes: 2,
    quorumRequired: 150,
    quorumMet: true,
  },
]

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    role: 'donor',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f42e0e',
    avatar: '/avatars/rajesh.jpg',
    joinedDate: '2024-01-15',
  },
  {
    id: 'user-002',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'donor',
    walletAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    avatar: '/avatars/priya.jpg',
    joinedDate: '2024-02-20',
  },
  {
    id: 'user-003',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'donor',
    walletAddress: '0x9E3AC5e4a6Ff5f4e7E8d0dC5BFd1f8C5F4E5D9a3',
    avatar: '/avatars/michael.jpg',
    joinedDate: '2024-03-10',
  },
  {
    id: 'user-004',
    name: 'Amara Okafor',
    email: 'amara@example.com',
    role: 'ngo',
    walletAddress: '0xABCDEF1234567890abcdef1234567890abcdef12',
    avatar: '/avatars/amara.jpg',
    joinedDate: '2024-01-01',
  },
  {
    id: 'user-005',
    name: 'James Wilson',
    email: 'james@example.com',
    role: 'ngo',
    walletAddress: '0x1234567890ABCDEFabcdef1234567890ABCDEF12',
    avatar: '/avatars/james.jpg',
    joinedDate: '2023-12-15',
  },
  {
    id: 'user-006',
    name: 'Fatima Hassan',
    email: 'fatima@example.com',
    role: 'voter',
    walletAddress: '0xFEDCBA9876543210fedcba9876543210fedcba98',
    avatar: '/avatars/fatima.jpg',
    joinedDate: '2024-05-01',
  },
  {
    id: 'user-007',
    name: 'David Thompson',
    email: 'david@example.com',
    role: 'voter',
    walletAddress: '0x5555555555555555555555555555555555555555',
    avatar: '/avatars/david.jpg',
    joinedDate: '2024-04-12',
  },
  {
    id: 'user-008',
    name: 'Admin User',
    email: 'admin@sahayata.io',
    role: 'admin',
    walletAddress: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    avatar: '/avatars/admin.jpg',
    joinedDate: '2023-01-01',
  },
]

// Mock NGO Organizations
export interface NGOOrganization {
  id: string
  name: string
  description: string
  website: string
  registrationNumber: string
  verificationStatus: 'verified' | 'pending' | 'rejected'
  campaignsManaged: number
  totalFundsManaged: number
  avatar: string
}

export const mockNGOs: NGOOrganization[] = [
  {
    id: 'ngo-001',
    name: 'International Disaster Relief Foundation',
    description: 'Global humanitarian organization focused on disaster relief and community recovery',
    website: 'https://idrf.org',
    registrationNumber: 'NGO-IND-2015-00142',
    verificationStatus: 'verified',
    campaignsManaged: 12,
    totalFundsManaged: 2500000,
    avatar: '/ngo-logos/idrf.png',
  },
  {
    id: 'ngo-002',
    name: 'Global Humanitarian Response',
    description: 'Emergency response and reconstruction in disaster-affected regions',
    website: 'https://ghr.org',
    registrationNumber: 'NGO-USA-2012-00089',
    verificationStatus: 'verified',
    campaignsManaged: 8,
    totalFundsManaged: 1800000,
    avatar: '/ngo-logos/ghr.png',
  },
  {
    id: 'ngo-003',
    name: 'United Crisis Response Team',
    description: 'Rapid response unit for humanitarian crises in Africa and Asia',
    website: 'https://ucrt.org',
    registrationNumber: 'NGO-GLOBAL-2018-00056',
    verificationStatus: 'verified',
    campaignsManaged: 6,
    totalFundsManaged: 950000,
    avatar: '/ngo-logos/ucrt.png',
  },
  {
    id: 'ngo-004',
    name: 'Community Recovery Alliance',
    description: 'Long-term community rebuilding and resilience programs',
    website: 'https://cra.org',
    registrationNumber: 'NGO-USA-2014-00123',
    verificationStatus: 'verified',
    campaignsManaged: 5,
    totalFundsManaged: 1200000,
    avatar: '/ngo-logos/cra.png',
  },
]

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2024-11-15T14:30:00Z',
    action: 'Donation Received',
    actor: 'user-001',
    details: 'Donation of 5000 USDC to campaign-001',
    severity: 'info',
  },
  {
    id: 'log-002',
    timestamp: '2024-11-15T12:15:00Z',
    action: 'Proof Verified',
    actor: 'user-006',
    details: 'Proof submission proof-001 verified on-chain',
    severity: 'info',
  },
  {
    id: 'log-003',
    timestamp: '2024-11-15T10:45:00Z',
    action: 'Proposal Executed',
    actor: 'system',
    details: 'Proposal prop-001 executed, 50000 USDC released to ngo-001',
    severity: 'info',
  },
  {
    id: 'log-004',
    timestamp: '2024-11-14T16:20:00Z',
    action: 'Vote Cast',
    actor: 'user-002',
    details: 'Voter cast support vote on proposal prop-002',
    severity: 'info',
  },
]

// Helper functions
export function getCampaignById(id: string): Campaign | undefined {
  return mockCampaigns.find((c) => c.id === id)
}

export function getDonationsByCampaign(campaignId: string): Donation[] {
  return mockDonations.filter((d) => d.campaignId === campaignId)
}

export function getProofsByNGO(ngoId: string): ProofSubmission[] {
  return mockProofSubmissions.filter((p) => p.ngoId === ngoId)
}

export function getProposalsByCampaign(campaignId: string): Proposal[] {
  return mockProposals.filter((p) => p.campaignId === campaignId)
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id)
}

export function getNGOById(id: string): NGOOrganization | undefined {
  return mockNGOs.find((n) => n.id === id)
}

export function getTotalDonationsByDonor(donorId: string): number {
  return mockDonations
    .filter((d) => d.donorId === donorId && d.status === 'confirmed')
    .reduce((sum, d) => sum + d.amount, 0)
}

export function getCampaignProgress(campaignId: string): number {
  const campaign = getCampaignById(campaignId)
  return campaign ? campaign.progressPercentage : 0
}
