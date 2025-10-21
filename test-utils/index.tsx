import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { ThemeProvider } from '@/components/theme/theme-provider'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from Testing Library
export * from '@testing-library/react'
export { customRender as render }

// Mock data helpers
export const createMockTrainingData = (overrides = {}) => ({
  id: 'test-id-1',
  title: 'Test Training',
  description: 'Test Description',
  category: 'warmup',
  duration: 600,
  ...overrides,
})

export const createMockVideoData = (overrides = {}) => ({
  id: 'test-video-1',
  title: 'Test Video',
  url: '/test-video.mp4',
  thumbnail: '/test-thumbnail.jpg',
  duration: 120,
  ...overrides,
})

// Common test utilities
export const waitForLoadingToFinish = () => new Promise(resolve => setTimeout(resolve, 0))

export const createMockLocalStorage = () => {
  const store: Record<string, string> = {}
  return {
    getItem: ((key: string) => store[key] || null),
    setItem: ((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: ((key: string) => {
      delete store[key]
    }),
    clear: (() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}