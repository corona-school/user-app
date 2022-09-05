import { ReactNode, useState } from 'react'
import { IModalTheme } from '../widgets/FullPageModal'

const useModal = () => {
  const [show, setShow] = useState<boolean>(false)
  const [content, setContent] = useState<ReactNode>()
  const [variant, setVariant] = useState<IModalTheme>('light')
  return { show, setShow, content, setContent, variant, setVariant }
}
export default useModal
