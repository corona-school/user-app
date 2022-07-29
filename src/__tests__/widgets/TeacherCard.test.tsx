import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import TeacherCard from '../../widgets/TeacherCard'

describe('TeacherCard', () => {
  test('renders correctly', () => {
    const { queryByText } = render(
      <TeacherCard tags={['Englisch', 'Mathematik']} name="Nele" />,
      { wrapper: TestWrapper }
    )
    expect(queryByText(/Nele/)).toBeInTheDocument()
    expect(queryByText(/Englisch/)).toBeInTheDocument()
    expect(queryByText(/Mathematik/)).toBeInTheDocument()
  })
})
