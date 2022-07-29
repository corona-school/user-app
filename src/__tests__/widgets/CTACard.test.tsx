import { render, fireEvent } from '@testing-library/react'
import { Button } from 'native-base'
import TestWrapper from '../../components/TestWrapper'
import CTACard from '../../widgets/CTACard'

describe('CTACard', () => {
  test('renders correctly', () => {
    const { getByText, queryByTestId } = render(
      <CTACard
        title="Lorem Ipsum"
        content="Dolor Sit Amet"
        button={<Button>TestButton</Button>}
      />,
      {
        wrapper: TestWrapper
      }
    )
    expect(getByText(/Lorem Ipsum/)).toBeInTheDocument()
    expect(getByText(/Dolor Sit Amet/)).toBeInTheDocument()
    expect(getByText(/TestButton/)).toBeInTheDocument()
    expect(queryByTestId('close')).toBeNull()
  })
  test('closeable works', () => {
    const click = jest.fn()
    const { queryByTestId, getByTestId } = render(
      <CTACard
        title="Lorem Ipsum"
        content="Dolor Sit Amet"
        button={<Button>TestButton</Button>}
        closeable
        onClose={click}
      />,
      { wrapper: TestWrapper }
    )
    expect(queryByTestId('close')).toBeInTheDocument()
    fireEvent.click(getByTestId('close'))
    expect(click).toHaveBeenCalledTimes(1)
  })
})
