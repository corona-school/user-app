import { render, screen, fireEvent } from '@testing-library/react'
import Tabs from '../../components/Tabs'
import TestWrapper from '../../components/TestWrapper'

test('renders Tabs correctly', () => {
  render(
    <Tabs
      tabs={[
        { title: 'Tab 1', content: 'content 1' },
        { title: 'Tab 2', content: 'content 2' }
      ]}
    />,
    {
      wrapper: TestWrapper
    }
  )

  expect(screen.queryByText(/Tab 1/)).toBeInTheDocument()
  expect(screen.queryByText(/Tab 2/)).toBeInTheDocument()
  expect(screen.queryByText(/content 1/)).toBeInTheDocument()
  expect(screen.queryByText(/content 2/)).toBeNull()
  fireEvent.click(screen.getByText(/Tab 2/))
  expect(screen.queryByText(/content 2/)).toBeInTheDocument()
  expect(screen.queryByText(/content 1/)).toBeNull()
})
