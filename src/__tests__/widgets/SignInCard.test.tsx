import { fireEvent, render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import SignInCard from '../../widgets/SignInCard'

describe('SignInCard', () => {
  test('renders correctly', () => {
    const date = new Date()
    const { queryByText } = render(
      <SignInCard
        date={date}
        numAppointments={3}
        tags={['Englisch', 'Informatik']}
        title="Lorem Ipsum"
      />,
      {
        wrapper: TestWrapper
      }
    )
    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
    expect(queryByText(/Englisch/)).toBeInTheDocument()
    expect(queryByText(/Informatik/)).toBeInTheDocument()
    expect(queryByText(/3 Termine/)).toBeInTheDocument()
    expect(queryByText(/Anmelden/)).toBeInTheDocument()
    expect(queryByText(`Ab ${date.toLocaleDateString()}`)).toBeInTheDocument()
  })

  test('on press sign in works', () => {
    const date = new Date()
    const click = jest.fn()
    const { getByText } = render(
      <SignInCard
        date={date}
        numAppointments={3}
        tags={['Englisch', 'Informatik']}
        title="Lorem Ipsum"
        onClickSignIn={click}
      />,
      {
        wrapper: TestWrapper
      }
    )
    fireEvent.click(getByText(/Anmelden/))
    expect(click).toHaveBeenCalledTimes(1)
  })
})
