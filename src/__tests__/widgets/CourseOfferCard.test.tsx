import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import CourseOfferCard from '../../widgets/CourseOfferCard'

test('renders CourseOfferCard correctly', () => {
  const date = new Date()
  const { getByText } = render(
    <CourseOfferCard
      title="Lorem Ipsum"
      date={date}
      tags={['Mathematik', 'Gruppenkurs']}
    />,
    {
      wrapper: TestWrapper
    }
  )
  expect(getByText(/Lorem Ipsum/)).toBeInTheDocument()
  expect(getByText(/Mathematik/)).toBeInTheDocument()
  expect(getByText(/Gruppenkurs/)).toBeInTheDocument()
  // check if both date time strings are shown correctly
  expect(getByText(date.toLocaleDateString())).toBeInTheDocument()
  expect(getByText(date.toLocaleTimeString().slice(0, -3))).toBeInTheDocument()
})
