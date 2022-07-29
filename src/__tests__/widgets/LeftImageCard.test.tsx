import { queryByText, render } from '@testing-library/react'
import { Text } from 'native-base'
import TestWrapper from '../../components/TestWrapper'
import LeftImageCard from '../../widgets/LeftImageCard'

describe('LeftImageCard', () => {
  test('renders correctly', () => {
    const { queryByText } = render(
      <LeftImageCard>
        <Text>Lorem Ipsum</Text>
      </LeftImageCard>,
      {
        wrapper: TestWrapper
      }
    )
    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
  })
})
