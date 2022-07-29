import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import SubjectTag from '../../widgets/SubjectTag'

describe('SubjectTag', () => {
  test('renders correctly', () => {
    const { queryByText } = render(<SubjectTag title="Lorem Ipsum" />, {
      wrapper: TestWrapper
    })
    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
  })
})
