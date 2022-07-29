import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import RatingTag from '../../widgets/RatingTag'

describe('RatingTag', () => {
  test('renders correctly', () => {
    const { queryByText, queryByTestId } = render(<RatingTag rating="4.1" />, {
      wrapper: TestWrapper
    })
    expect(queryByText(/4.1/)).toBeInTheDocument()
    expect(queryByTestId('afterElement')).toBeInTheDocument()
  })
})
