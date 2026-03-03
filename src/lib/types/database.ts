export type UserRole = 'customer' | 'provider' | 'admin'
export type KYCStatus = 'pending' | 'under_review' | 'approved' | 'rejected'
export type ProviderStatus = 'offline' | 'online' | 'busy'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  phone: string | null
  avatar_url: string | null
  onboarding_complete: boolean
  created_at: string
  updated_at: string
}

export interface CustomerProfile {
  id: string
  saved_addresses: SavedAddress[]
  stripe_customer_id: string | null
  created_at: string
}

export interface ProviderProfile {
  id: string
  business_name: string | null
  bio: string | null
  skills: string[]
  kyc_status: KYCStatus
  kyc_document_url: string | null
  kyc_reviewed_at: string | null
  kyc_rejection_reason: string | null
  status: ProviderStatus
  last_lat: number | null
  last_lng: number | null
  last_seen_at: string | null
  rating_avg: number
  rating_count: number
  acceptance_rate: number
  completion_rate: number
  stripe_account_id: string | null
  hourly_rate: number | null
  created_at: string
  updated_at: string
}

export interface AdminProfile {
  id: string
  permissions: string[]
  created_at: string
}

export interface SavedAddress {
  label: string
  address_text: string
  lat: number
  lng: number
}

export type ProfileWithCustomer = Profile & { customer_profiles: CustomerProfile | null }
export type ProfileWithProvider = Profile & { provider_profiles: ProviderProfile | null }
export type ProfileWithRole = ProfileWithCustomer | ProfileWithProvider | Profile
