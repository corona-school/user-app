import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import AppointmentCard from '../../widgets/AppointmentCard'

test('renders AppointmentCard correctly', () => {
  const date = new Date()

  const { queryByText } = render(
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
  expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
  expect(queryByText(/Nele/)).toBeInTheDocument()
  expect(queryByText(/Englisch/)).toBeInTheDocument()
  expect(queryByText(/Mathematik/)).toBeInTheDocument()
  expect(queryByText(`${date.toLocaleDateString()}`)).toBeInTheDocument()
})
