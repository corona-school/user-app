import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import StudyPartnerCard from '../../widgets/StudyPartnerCard'

describe('StudyPartnerCard', () => {
  test('renders correctly', () => {
    const date = new Date()
    const { queryByText } = render(
      <StudyPartnerCard
        title="Lorem Ipsum"
        tags={['Englisch', 'Mathematik']}
        date={date}
      />,
      {
        wrapper: TestWrapper
      }
    )
    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
    expect(queryByText(/Englisch/)).toBeInTheDocument()
    expect(queryByText(/Mathematik/)).toBeInTheDocument()
    // test if both date and time are shown
    expect(queryByText(date.toLocaleDateString())).toBeInTheDocument()
    expect(
      queryByText(date.toLocaleTimeString().slice(0, -3))
    ).toBeInTheDocument()
  })
})
