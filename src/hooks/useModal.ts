import { ReactNode, useState } from 'react'

const useModal = () => {
  const [show, setShow] = useState<boolean>(false)
  const [content, setContent] = useState<ReactNode>()
  return { show, setShow, content, setContent }
}
export default useModal
