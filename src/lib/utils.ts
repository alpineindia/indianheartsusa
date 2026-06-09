import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInYears, differenceInDays, differenceInHours, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAge(dob: Date) {
  return differenceInYears(new Date(), dob)
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function maskPhone(phone: string) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export interface ProfileCompletenessResult {
  score: number
  percentage: number
  missing: string[]
}

export function computeProfileCompleteness(profile: any): ProfileCompletenessResult {
  const fields = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'religion', label: 'Religion' },
    { key: 'profession', label: 'Profession' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'aboutMe', label: 'About You' },
    { key: 'foodPreference', label: 'Food Preference' },
    { key: 'height', label: 'Height' },
    { key: 'education', label: 'Education' },
    { key: 'motherTongue', label: 'Mother Tongue' },
    { key: 'expectations', label: 'Expectations' },
  ]

  const photoCheck = { key: 'photoUrls', label: 'Profile Photo' }
  const willingCheck = { key: 'willingToRelocate', label: 'Relocation Status' }

  let completed = 0
  const missing: string[] = []

  for (const field of fields) {
    if (profile[field.key]) {
      completed++
    } else {
      missing.push(field.label)
    }
  }

  if (profile.photoUrls && profile.photoUrls.length > 0) {
    completed++
  } else {
    missing.push(photoCheck.label)
  }

  if (profile.willingToRelocate !== undefined && profile.willingToRelocate !== null) {
    completed++
  } else {
    missing.push(willingCheck.label)
  }

  const totalFields = fields.length + 2
  const percentage = Math.round((completed / totalFields) * 100)

  return {
    score: completed,
    percentage,
    missing,
  }
}

export function formatLastActive(lastActiveAt: Date | null | undefined): string {
  if (!lastActiveAt) return 'Never active'
  const now = new Date()
  const hoursAgo = differenceInHours(now, new Date(lastActiveAt))

  if (hoursAgo < 1) return 'Active now'
  if (hoursAgo < 24) return `Active ${hoursAgo}h ago`

  const daysAgo = differenceInDays(now, new Date(lastActiveAt))
  if (daysAgo < 7) return `Active ${daysAgo}d ago`

  return formatDistanceToNow(new Date(lastActiveAt), { addSuffix: true })
}
