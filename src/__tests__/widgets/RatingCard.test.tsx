import { render } from '@testing-library/react'
import { Text } from 'native-base'
import TestWrapper from '../../components/TestWrapper'
import RatingCard from '../../widgets/RatingCard'

describe('RatingCard', () => {
  test('renders correctly', () => {
    const { queryByText } = render(
      <RatingCard avatar="" name="Nele" rating={4} content="Lorem Ipsum" />,
      { wrapper: TestWrapper }
    )
    expect(queryByText(/Nele/)).toBeInTheDocument()
    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
  })
})
