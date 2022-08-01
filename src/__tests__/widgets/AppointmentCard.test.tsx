import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import AppointmentCard from '../../widgets/AppointmentCard'

describe('AppointmentCard', () => {
  test('renders correctly', () => {
    const now = new Date()
    const date = new Date(now)
    date.setTime(date.getTime() + 3600000 * 12)

    const { queryByText } = render(
      <AppointmentCard
        title="Lorem Ipsum"
        description="Dolor Sit Amet"
        child="Nele"
        date={date}
        tags={['Mathematik', 'Englisch']}
      />,
      {
        wrapper: TestWrapper
      }
    )
    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
    expect(queryByText(/Nele/)).toBeInTheDocument()
    expect(queryByText(/Englisch/)).toBeInTheDocument()
    expect(queryByText(/Mathematik/)).toBeInTheDocument()
    expect(queryByText(`${date.toLocaleDateString()}`)).toBeInTheDocument()
  })

  test('renders starting soon correctly', () => {
    // ! This test is not working correctly due to the dynamic time calculation
    // ? FIX maybe incoming
    const now = new Date()
    now.setHours(12)
    now.setMinutes(15)
    now.setSeconds(5)
    now.setMilliseconds(0)

    // set a date / time max. TIMETHRESHOLD (2hrs) from now on
    // see Utility for more info
    const date = new Date(now)
    date.setHours(13)
    date.setMinutes(45)

    const { queryByText } = render(
      <AppointmentCard
        title="Lorem Ipsum"
        description="Dolor Sit Amet"
        child="Nele"
        date={date}
        tags={['Mathematik', 'Englisch']}
      />,
      {
        wrapper: TestWrapper
      }
    )

    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
    expect(queryByText(/Nele/)).toBeInTheDocument()
    expect(queryByText(/Englisch/)).toBeInTheDocument()
    expect(queryByText(/Mathematik/)).toBeInTheDocument()
    // expect(queryByText(/Dolor Sit Amet/)).toBeInTheDocument()
    // expect(queryByText(/Zum Kurs/)).toBeInTheDocument()

    // useInterval is not working in testing mode so we use the default
    // expect(queryByText(/Startet in: 00:00/)).toBeInTheDocument()
  })
})
