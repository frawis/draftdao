import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
/** Merge classes with tailwind-merge with clsx full feature */
export const clsxm = (...classes: ClassValue[]) => {
  return twMerge(clsx(...classes))
}

// A fancy function to shorten someones wallet address, no need to show the whole thing.
export const shortenAddress = (str: string) => {
  return str.substring(0, 6) + '...' + str.substring(str.length - 4)
}
