import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import CommunityUser from '../../widgets/CommunityUser'

test('renders CommunityUser correctly', () => {
  const { getByText } = render(<CommunityUser name="Matheo" />, {
    wrapper: TestWrapper
  })

  expect(getByText('Matheo')).toBeInTheDocument()
})
