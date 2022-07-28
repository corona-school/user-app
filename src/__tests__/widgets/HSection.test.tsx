import { fireEvent, render } from '@testing-library/react'
import { Text } from 'native-base'
import TestWrapper from '../../components/TestWrapper'
import HSection from '../../widgets/HSection'

describe('HSection', () => {
  test('renders correctly', () => {
    const { queryByText } = render(
      <HSection title="My Title">
        <Text>Lorem Ipsum Dolor Sit Amet</Text>
      </HSection>,
      {
        wrapper: TestWrapper
      }
    )
    expect(queryByText(/My Title/)).toBeInTheDocument()
    expect(queryByText(/Lorem Ipsum Dolor Sit Amet/)).toBeInTheDocument()
  })
  test('show all works', () => {
    const click = jest.fn()
    const { queryByText, getByText } = render(
      <HSection showAll onShowAll={click}>
        <></>
      </HSection>,
      {
        wrapper: TestWrapper
      }
    )
    expect(queryByText(/Alle/)).toBeInTheDocument()
    fireEvent.click(getByText(/Alle/))
    expect(click).toHaveBeenCalledTimes(1)
  })
})
