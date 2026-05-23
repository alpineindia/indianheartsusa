import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInYears } from 'date-fns'

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
