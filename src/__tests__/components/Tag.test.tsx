import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'

import Tag from '../../components/Tag'
import { View } from 'native-base'

test('renders Tag component with text', () => {
  const { queryByText } = render(<Tag text="Lorem Ipsum" />, {
    wrapper: TestWrapper
  })
  expect(queryByText('Lorem Ipsum')).toBeInTheDocument()
})

test('renders beforeElement', () => {
  const { queryByTestId } = render(
    <Tag text="Lorem Ipsum" beforeElement={<View></View>} />,
    {
      wrapper: TestWrapper
    }
  )
  expect(queryByTestId('beforeElement')).toBeInTheDocument()
  expect(queryByTestId('afterElement')).toBeNull()
})

test('renders afterElement', () => {
  const { queryByTestId } = render(
    <Tag text="Lorem Ipsum" afterElement={<View></View>} />,
    {
      wrapper: TestWrapper
    }
  )
  expect(queryByTestId('afterElement')).toBeInTheDocument()
  expect(queryByTestId('beforeElement')).toBeNull()
})
