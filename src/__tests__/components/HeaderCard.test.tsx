import { render } from '@testing-library/react'
import { Text } from 'native-base'
import HeaderCard from '../../components/HeaderCard'
import TestWrapper from '../../components/TestWrapper'

describe('HeaderCard', () => {
  test('renders correctly', () => {
    const { getByText } = render(
      <HeaderCard>
        <Text>Hallo Milan!</Text>
      </HeaderCard>,
      { wrapper: TestWrapper }
    )

    expect(getByText(/Hallo Milan/)).toBeInTheDocument()
  })
})
