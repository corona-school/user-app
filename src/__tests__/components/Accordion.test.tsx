import { fireEvent, render } from '@testing-library/react'
import { Text } from 'native-base'
import Accordion from '../../components/Accordion'
import TestWrapper from '../../components/TestWrapper'

describe('Accordion', () => {
  test('Accordion renders correctly', () => {
    const { getByText } = render(
      <Accordion title="Lorem Ipsum">
        <Text>Dolor Sit Amet</Text>
      </Accordion>,
      { wrapper: TestWrapper }
    )
    setTimeout(() => {
      expect(getByText(/Lorem Ipsum/)).toBeInTheDocument()
      expect(getByText(/Dolor Sit Amet/)).toBeInTheDocument()
      expect(getByText(/Dolor Sit Amet/)).not.toBeVisible()
    }, 0)
  })
  test('Accordion opens correctly', () => {
    const { getByText } = render(
      <Accordion title="Lorem Ipsum">
        <Text>Dolor Sit Amet</Text>
      </Accordion>,
      { wrapper: TestWrapper }
    )
    fireEvent.click(getByText(/Lorem Ipsum/))
    setTimeout(() => {
      expect(getByText(/Dolor Sit Amet/)).toBeVisible()
    }, 0)
  })
})
