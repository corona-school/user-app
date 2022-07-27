import { render, screen } from '@testing-library/react'
import { Text } from 'native-base'
import DataRow from '../../components/DataRow'
import TestWrapper from '../../components/TestWrapper'

test('DataRow renders children', () => {
  render(
    <DataRow>
      <Text testID="text1">Lorem Ipsum</Text>
      <Text testID="text2">Lorem Ipsum</Text>
    </DataRow>,
    { wrapper: TestWrapper }
  )
})
