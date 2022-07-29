import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import SimpleDataRow from '../../widgets/SimpleDataRow'

describe('SimpleDataRow', () => {
  test('renders correctly', () => {
    const { queryByText } = render(
      <SimpleDataRow label="Lorem Ipsum" value="Dolor Sit Amet" />,
      {
        wrapper: TestWrapper
      }
    )
    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
    expect(queryByText(/Dolor Sit Amet/)).toBeInTheDocument()
  })
})
