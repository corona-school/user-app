import { render } from '@testing-library/react'
import { Text } from 'native-base'
import TestWrapper from '../../components/TestWrapper'
import LearningPartner from '../../widgets/LearningPartner'

describe('LearningPartner', () => {
  test('renders correctly', () => {
    const { queryByText } = render(
      <LearningPartner
        avatar=""
        name="Milan"
        fach={['Englisch', 'Informatik']}
        schulform="Gymnasium"
        klasse={13}
      />,
      { wrapper: TestWrapper }
    )
    expect(queryByText(/Milan/)).toBeInTheDocument()
    expect(
      queryByText(`Fach: ${['Englisch', 'Informatik'].join(', ')}`)
    ).toBeInTheDocument()
    expect(queryByText(/Schulform: Gymnasium/)).toBeInTheDocument()
    expect(queryByText(/Klasse: 13/)).toBeInTheDocument()
  })
})
