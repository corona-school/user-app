import { render, screen } from '@testing-library/react'
import { Text } from 'native-base'
import DataRow from '../../components/DataRow'
import TestWrapper from '../../components/TestWrapper'

test('DataRow renders children', () => {
  render(
    <DataRow>
      <Text>Lorem Ipsum 1</Text>
      <Text>Lorem Ipsum 2</Text>
    </DataRow>,
    { wrapper: TestWrapper }
  )
  expect(screen.queryByText(/Lorem Ipsum 1/)).toBeInTheDocument()
  expect(screen.queryByText(/Lorem Ipsum 2/)).toBeInTheDocument()
})
