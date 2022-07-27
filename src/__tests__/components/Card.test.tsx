import { render, screen } from '@testing-library/react'
import { Text } from 'native-base'
import Card from '../../components/Card'
import TestWrapper from '../../components/TestWrapper'

test('Card renders children', () => {
  render(
    <Card>
      <Text testID="text1">Lorem Ipsum</Text>
      <Text testID="text2">Lorem Ipsum</Text>
    </Card>,
    { wrapper: TestWrapper }
  )
  expect(screen.queryByTestId('text1')).toBeInTheDocument()
  expect(screen.queryByTestId('text2')).toBeInTheDocument()
})
