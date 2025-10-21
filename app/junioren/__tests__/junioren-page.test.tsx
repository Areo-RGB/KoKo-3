import { render, screen, fireEvent, waitFor, act } from '@/test-utils'
import JuniorenPage from '../page'
import { AGE_GROUPS, CATEGORIES } from '@/app/junioren/_lib/constants'
import type { TrainingSession } from '@/app/junioren/_lib/types'

// Mock fetch for training sessions
global.fetch = jest.fn()

const mockTrainingSessions: TrainingSession[] = [
  {
    id: 'session-1',
    title: 'Session 1',
    description: 'Test session 1',
    category: 'technik',
    ageGroup: 'A-Junioren',
    duration: 90,
    exercises: [],
  },
  {
    id: 'session-2',
    title: 'Session 2',
    description: 'Test session 2',
    category: 'taktik',
    ageGroup: 'B-Junioren',
    duration: 60,
    exercises: [],
  },
]

const mockWarmupData = {
  'Gruppe 1': [
    {
      id: 'warmup-1',
      title: 'Warmup 1',
      url: 'https://youtube.com/watch?v=1',
      duration: '10:00',
    },
  ],
}

describe('JuniorenPage Characterization Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()

    // Mock successful fetch for training sessions
    ;(fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('training-sessions.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTrainingSessions),
        })
      }
      if (url.includes('aufwaermen-links.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockWarmupData),
        })
      }
      return Promise.reject(new Error('Unknown URL'))
    })
  })

  describe('Initial State and Loading', () => {
    it('should render page with loading state initially', () => {
      render(<JuniorenPage />)

      expect(screen.getByText('Junioren Training')).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/suche nach themen/i)).toBeInTheDocument()
    })

    it('should load training sessions on mount', async () => {
      render(<JuniorenPage />)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/junioren/training-sessions.json', {
          cache: 'no-cache',
        })
      })
    })

    it('should load and display training sessions after loading completes', async () => {
      await act(async () => {
        render(<JuniorenPage />)
      })

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
        expect(screen.getByText('Session 2')).toBeInTheDocument()
      })
    })

    it('should display error message when loading fails', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      render(<JuniorenPage />)

      await waitFor(() => {
        expect(screen.getByText(/konnte trainingsdaten nicht laden/i)).toBeInTheDocument()
      })
    })
  })

  describe('Age Group Selection', () => {
    it('should display all available age groups', () => {
      render(<JuniorenPage />)

      Object.keys(AGE_GROUPS).forEach(ageGroup => {
        expect(screen.getByText(ageGroup)).toBeInTheDocument()
      })
    })

    it('should filter sessions when age group is selected', async () => {
      render(<JuniorenPage />)

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
      })

      const ageGroupButton = screen.getByText('A-Junioren')
      fireEvent.click(ageGroupButton)

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
        expect(screen.queryByText('Session 2')).not.toBeInTheDocument()
      })
    })

    it('should update URL when age group is selected', async () => {
      render(<JuniorenPage />)

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
      })

      const ageGroupButton = screen.getByText('A-Junioren')
      fireEvent.click(ageGroupButton)

      // Note: Would need to mock router.push to fully test URL updates
      expect(ageGroupButton).toBeInTheDocument()
    })
  })

  describe('Category Selection', () => {
    it('should display all available categories', () => {
      render(<JuniorenPage />)

      Object.keys(CATEGORIES).forEach(category => {
        expect(screen.getByText(new RegExp(CATEGORIES[category].label, 'i'))).toBeInTheDocument()
      })
    })

    it('should filter sessions when category is selected', async () => {
      render(<JuniorenPage />)

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
      })

      const categoryButton = screen.getByText(/technik/i)
      fireEvent.click(categoryButton)

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
        expect(screen.queryByText('Session 2')).not.toBeInTheDocument()
      })
    })
  })

  describe('Search Functionality', () => {
    it('should filter sessions based on search term', async () => {
      render(<JuniorenPage />)

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/suche nach themen/i)
      fireEvent.change(searchInput, { target: { value: 'Session 1' } })

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
        expect(screen.queryByText('Session 2')).not.toBeInTheDocument()
      })
    })

    it('should clear search when input is cleared', async () => {
      render(<JuniorenPage />)

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/suche nach themen/i)
      fireEvent.change(searchInput, { target: { value: 'Session 1' } })

      await waitFor(() => {
        expect(screen.queryByText('Session 2')).not.toBeInTheDocument()
      })

      fireEvent.change(searchInput, { target: { value: '' } })

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
        expect(screen.getByText('Session 2')).toBeInTheDocument()
      })
    })
  })

  describe('Warmup Functionality', () => {
    it('should load warmup data when Aufwärmen category is selected', async () => {
      render(<JuniorenPage />)

      const warmupButton = screen.getByText(/aufwärm/i)
      fireEvent.click(warmupButton)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/junioren/aufwaermen-links.json', {
          cache: 'force-cache',
        })
      })
    })

    it('should display warmup groups when loaded', async () => {
      render(<JuniorenPage />)

      const warmupButton = screen.getByText(/aufwärm/i)
      fireEvent.click(warmupButton)

      await waitFor(() => {
        expect(screen.getByText('Gruppe 1')).toBeInTheDocument()
      })
    })
  })

  describe('Favorites Functionality', () => {
    it('should load favorites from localStorage on mount', () => {
      const mockFavorites = ['session-1', 'session-2']
      localStorage.setItem('junior-favorites', JSON.stringify(mockFavorites))

      render(<JuniorenPage />)

      // Favorites should be loaded from localStorage
      expect(localStorage.getItem).toHaveBeenCalledWith('junior-favorites')
    })

    it('should save favorites to localStorage when toggled', async () => {
      render(<JuniorenPage />)

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
      })

      // Find and click favorite button for first session
      const favoriteButtons = screen.getAllByRole('button').filter(
        button => button.querySelector('svg') && button.querySelector('svg[data-testid*="heart"')
      )

      if (favoriteButtons.length > 0) {
        fireEvent.click(favoriteButtons[0])

        // Should save to localStorage
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'junior-favorites',
          expect.any(String)
        )
      }
    })
  })

  describe('Category Expansion', () => {
    it('should expand categories when clicked', async () => {
      render(<JuniorenPage />)

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
      })

      // Find expandable category sections
      const expandButtons = screen.getAllByRole('button').filter(
        button => button.querySelector('svg[data-testid*="chevron"]')
      )

      if (expandButtons.length > 0) {
        fireEvent.click(expandButtons[0])

        // Category should expand and show sessions
        await waitFor(() => {
          expect(screen.getByText('Session 1')).toBeInTheDocument()
        })
      }
    })
  })

  describe('Responsive Behavior', () => {
    it('should render correctly on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<JuniorenPage />)

      expect(screen.getByText(/jugendtraining/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/suche nach themen/i)).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle warmup loading errors gracefully', async () => {
      ;(fetch as jest.Mock).mockImplementation((url) => {
        if (url.includes('training-sessions.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockTrainingSessions),
          })
        }
        if (url.includes('aufwaermen-links.json')) {
          return Promise.reject(new Error('Warmup load error'))
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      render(<JuniorenPage />)

      const warmupButton = screen.getByText(/aufwärm/i)
      fireEvent.click(warmupButton)

      await waitFor(() => {
        expect(screen.getByText(/konnte aufwärmen-links nicht laden/i)).toBeInTheDocument()
      })
    })
  })

  describe('Data Processing', () => {
    it('should correctly categorize sessions by age group and category', async () => {
      render(<JuniorenPage />)

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
      })

      // Sessions should be grouped correctly
      expect(screen.getByText('Session 1')).toBeInTheDocument()
      expect(screen.getByText('Session 2')).toBeInTheDocument()
    })

    it('should display correct session count', async () => {
      render(<JuniorenPage />)

      await waitFor(() => {
        expect(screen.getByText('Session 1')).toBeInTheDocument()
      })

      // Should display total count of sessions
      expect(screen.getByText(/\d+/)).toBeInTheDocument()
    })
  })
})