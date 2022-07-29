import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import ServiceOfferCard from '../../widgets/ServiceOfferCard'

describe('ServiceOfferCard', () => {
  test('renders correctly', () => {
    const { queryByText } = render(<ServiceOfferCard title="Lorem Ipsum" />, {
      wrapper: TestWrapper
    })
    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
  })
})
