import { render, screen } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import AppointmentCard from '../../widgets/AppointmentCard'

test('renders AppointmentCard correctly', () => {
  const date = new Date()

  render(
    <AppointmentCard
      title="Lorem Ipsum"
      child="Nele"
      date={date}
      tags={['Mathematik', 'Englisch']}
    />,
    {
      wrapper: TestWrapper
    }
  )
  expect(screen.queryByText(/Lorem Ipsum/)).toBeInTheDocument()
  expect(screen.queryByText(/Nele/)).toBeInTheDocument()
  expect(screen.queryByText(/Englisch/)).toBeInTheDocument()
  expect(screen.queryByText(/Mathematik/)).toBeInTheDocument()
  expect(screen.queryByText(`${date.toLocaleDateString()}`)).toBeInTheDocument()
})
