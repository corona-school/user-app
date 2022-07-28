import { render, fireEvent } from '@testing-library/react'
import Tabs from '../../components/Tabs'
import TestWrapper from '../../components/TestWrapper'

test('renders Tabs correctly', () => {
  const { queryByText, getByText } = render(
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

  expect(queryByText(/Tab 1/)).toBeInTheDocument()
  expect(queryByText(/Tab 2/)).toBeInTheDocument()
  expect(queryByText(/content 1/)).toBeInTheDocument()
  expect(queryByText(/content 2/)).toBeNull()
  fireEvent.click(getByText(/Tab 2/))
  expect(queryByText(/content 2/)).toBeInTheDocument()
  expect(queryByText(/content 1/)).toBeNull()
})
