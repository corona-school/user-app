import { render, screen } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'

import Tag from '../../components/Tag'
import { View } from 'native-base'

test('renders Tag component with text', () => {
  render(<Tag text="Lorem Ipsum" />, { wrapper: TestWrapper })
  expect(screen.queryByText('Lorem Ipsum')).toBeInTheDocument()
})

test('renders beforeElement', () => {
  render(<Tag text="Lorem Ipsum" beforeElement={<View></View>} />, {
    wrapper: TestWrapper
  })
  expect(screen.queryByTestId('beforeElement')).toBeInTheDocument()
  expect(screen.queryByTestId('afterElement')).toBeNull()
})

test('renders afterElement', () => {
  render(<Tag text="Lorem Ipsum" afterElement={<View></View>} />, {
    wrapper: TestWrapper
  })
  expect(screen.queryByTestId('afterElement')).toBeInTheDocument()
  expect(screen.queryByTestId('beforeElement')).toBeNull()
})
