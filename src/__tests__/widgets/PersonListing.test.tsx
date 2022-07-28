import { fireEvent, render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import PersonListing from '../../widgets/PersonListing'

describe('PersonListing', () => {
  test('renders correctly', () => {
    const { queryByText } = render(<PersonListing username="Milan" />, {
      wrapper: TestWrapper
    })

    expect(queryByText(/Milan/)).toBeInTheDocument()
  })
  test('pressing link works', () => {
    const click = jest.fn()
    const { queryByText, getByText } = render(
      <PersonListing username="Milan" onPressLink={click} />,
      {
        wrapper: TestWrapper
      }
    )
    expect(queryByText(/Milan/)).toBeInTheDocument()
    fireEvent.click(getByText(/Milan/))
    expect(click).toHaveBeenCalledTimes(1)
  })
})
