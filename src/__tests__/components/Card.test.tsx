import { render } from '@testing-library/react'
import { Text } from 'native-base'
import Card from '../../components/Card'
import TestWrapper from '../../components/TestWrapper'

test('Card renders children', () => {
  const { queryByText } = render(
    <Card>
      <Text>Lorem Ipsum 1</Text>
      <Text>Lorem Ipsum 2</Text>
    </Card>,
    { wrapper: TestWrapper }
  )
  expect(queryByText('Lorem Ipsum 1')).toBeInTheDocument()
  expect(queryByText('Lorem Ipsum 2')).toBeInTheDocument()
})
