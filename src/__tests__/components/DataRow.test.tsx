import { render } from '@testing-library/react'
import { Text } from 'native-base'
import DataRow from '../../components/DataRow'
import TestWrapper from '../../components/TestWrapper'

test('DataRow renders children', () => {
  const { queryByText } = render(
    <DataRow>
      <Text>Lorem Ipsum 1</Text>
      <Text>Lorem Ipsum 2</Text>
    </DataRow>,
    { wrapper: TestWrapper }
  )
  expect(queryByText(/Lorem Ipsum 1/)).toBeInTheDocument()
  expect(queryByText(/Lorem Ipsum 2/)).toBeInTheDocument()
})
