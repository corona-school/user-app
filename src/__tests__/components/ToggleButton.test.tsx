import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import ToggleButton from '../../components/ToggleButton'

describe('ToggleButton', () => {
  test('renders correctly', () => {
    const { getByText } = render(<ToggleButton label="Lorem Ipsum" />, {
      wrapper: TestWrapper
    })

    expect(getByText(/Lorem Ipsum/)).toBeInTheDocument()
  })
})
