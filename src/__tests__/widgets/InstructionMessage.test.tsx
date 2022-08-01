import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import InstructionMessage from '../../widgets/InstructionMessage'

describe('InstructionMessage', () => {
  test('renders correctly', () => {
    const { queryByText } = render(
      <InstructionMessage title="Lorem Ipsum" text="Dolor Sit Amet" />,
      { wrapper: TestWrapper }
    )
    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
    expect(queryByText(/Dolor Sit Amet/)).toBeInTheDocument()
  })
})
