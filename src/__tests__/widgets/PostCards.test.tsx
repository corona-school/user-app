import { fireEvent, render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import PostCards from '../../widgets/PostCards'

describe('PostCards', () => {
  test('renders correctly', () => {
    const { queryByText } = render(
      <PostCards title="Lorem Ipsum" content="Dolor Sit Amet" />,
      { wrapper: TestWrapper }
    )

    expect(queryByText(/Lorem Ipsum/)).toBeInTheDocument()
    expect(queryByText(/Dolor Sit Amet/)).toBeInTheDocument()
  })
  test('on press link works', () => {
    const click = jest.fn()
    const { queryByText, getByText } = render(
      <PostCards onPressLink={click} />,
      {
        wrapper: TestWrapper
      }
    )
    expect(queryByText(/Artikel lesen/)).toBeInTheDocument()
    fireEvent.click(getByText(/Artikel lesen/))
    expect(click).toHaveBeenCalledTimes(1)
  })
})
