import { useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

type SetValue<T> = Dispatch<SetStateAction<T>>

const isBrowser = typeof window !== 'undefined'

/**
 * React state that persists to localStorage. Removes the key when the value becomes null.
 */
export function useStoredState<T>(key: string, defaultValue: T): [T, SetValue<T>] {
  const isFirst = useRef(true)
  const [value, setValue] = useState<T>(() => {
    if (!isBrowser) return defaultValue
    const stored = window.localStorage.getItem(key)
    if (stored === null) return defaultValue
    try {
      return JSON.parse(stored) as T
    } catch (error) {
      console.warn(`Failed to parse localStorage key "${key}"`, error)
      return defaultValue
    }
  })

  useEffect(() => {
    if (!isBrowser) return

    if (isFirst.current) {
      isFirst.current = false
      return
    }

    try {
      if ((value as unknown) === null) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.warn(`Failed to write localStorage key "${key}"`, error)
    }
  }, [key, value])

  return [value, setValue]
}