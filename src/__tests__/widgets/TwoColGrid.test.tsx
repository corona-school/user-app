import { render } from '@testing-library/react'
import { Text } from 'native-base'
import TestWrapper from '../../components/TestWrapper'
import TwoColGrid from '../../widgets/TwoColGrid'

describe('TwoColGrid', () => {
  test('renders correctly', () => {
    const { queryByText } = render(
      <TwoColGrid title="Lorem Ipsum">
        <Text>Col 1</Text>
        <Text>Col 2</Text>
        <Text>Col 3</Text>
      </TwoColGrid>,
      { wrapper: TestWrapper }
    )
    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
    expect(queryByText(/Col 1/)).toBeInTheDocument()
    expect(queryByText(/Col 2/)).toBeInTheDocument()
    expect(queryByText(/Col 3/)).toBeInTheDocument()
  })
})
