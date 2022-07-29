import {
  fireEvent,
  getByText,
  queryByText,
  render
} from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import EditDataRow from '../../widgets/EditDataRow'

describe('EditDataRow', () => {
  test('renders label', () => {
    const { queryByText } = render(<EditDataRow label="Lorem Ipsum" />, {
      wrapper: TestWrapper
    })

    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
  })
  test('renders label with value', () => {
    const { queryByText } = render(
      <EditDataRow label="Lorem Ipsum" value="Dolor Sit Amet" />,
      {
        wrapper: TestWrapper
      }
    )

    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
    expect(queryByText(/Dolor Sit Amet/)).toBeInTheDocument()
  })
  test('onPress works', () => {
    const click = jest.fn()
    const { getByText } = render(
      <EditDataRow
        label="Lorem Ipsum"
        value="Dolor Sit Amet"
        onPress={click}
      />,
      {
        wrapper: TestWrapper
      }
    )
    fireEvent.click(getByText(/Lorem Ipsum/))
    expect(click).toHaveBeenCalledTimes(1)
  })
})
