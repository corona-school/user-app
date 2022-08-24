import { render } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'
import TestWrapper from '../../components/TestWrapper'
import useModal from '../../hooks/useModal'
import FullPageModal from '../../widgets/FullPageModal'

describe('FullPageModal', () => {
  test('FullPageModal renders correctly', () => {
    const { getByTestId } = render(<FullPageModal />, { wrapper: TestWrapper })
    expect(getByTestId('fullpagemodal')).toBeInTheDocument()
    expect(getByTestId('fullpagemodal__content')).not.toBeVisible()
  })
  test('FullPageModal renders correctly', () => {
    const { result } = renderHook(() => useModal())
    act(() => {
      result.current.setShow(true)
    })

    setTimeout(() => {
      const { getByTestId } = render(<FullPageModal />, {
        wrapper: TestWrapper
      })
      expect(getByTestId('fullpagemodal')).toBeInTheDocument()
      expect(getByTestId('fullpagemodal__content')).toBeVisible()
    }, 500)
  })
})
