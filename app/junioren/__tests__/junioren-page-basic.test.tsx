import { render, screen } from '@/test-utils'

// Mock dependencies to simplify testing
jest.mock('@/app/junioren/_components/cache-control', () => ({
  CacheControl: () => <div data-testid="cache-control">Cache Control</div>,
}))

jest.mock('@/app/junioren/_lib/aufwaermen-data', () => ({
  getWarmupsFromMap: jest.fn(() => []),
  type: {},
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/junioren',
}))

jest.mock('@/hooks/use-cache-manager', () => ({
  useCacheManager: () => ({
    storageEstimate: { quota: 1000000, usage: 500000, usageDetails: {} },
    isInitialized: true,
    error: null,
    refreshStorageEstimate: jest.fn(),
  }),
}))

describe('JuniorenPage Basic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock fetch for training sessions
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as jest.Mock

    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    })
  })

  it('should render the page without crashing', () => {
    render(require('../page').default)

    expect(screen.getByText('Junioren Training')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/suche nach themen/i)).toBeInTheDocument()
  })

  it('should display age group buttons', () => {
    render(require('../page').default)

    expect(screen.getByText('A-Junioren')).toBeInTheDocument()
    expect(screen.getByText('B-Junioren')).toBeInTheDocument()
    expect(screen.getByText('C-Junioren')).toBeInTheDocument()
  })

  it('should display category buttons', () => {
    render(require('../page').default)

    expect(screen.getByText(/technik/i)).toBeInTheDocument()
    expect(screen.getByText(/taktik/i)).toBeInTheDocument()
    expect(screen.getByText(/aufwärm/i)).toBeInTheDocument()
  })

  it('should have search input field', () => {
    render(require('../page').default)

    const searchInput = screen.getByPlaceholderText(/suche nach themen/i)
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('type', 'search')
  })
})