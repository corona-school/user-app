import { Flex, Row, CircleIcon, useTheme, Button } from 'native-base'
import { ReactNode, useState } from 'react'

type Props = {
  children: ReactNode | ReactNode[]
  onSkip: () => any
  onNext: (currentIndex: number) => any
  loop?: boolean
}

const ViewPager: React.FC<Props> = ({ children, onSkip, onNext, loop }) => {
  const { space } = useTheme()
  const isMultiple = Array.isArray(children)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  return (
    <Flex h="100%" flex="1" flexGrow={1}>
      <Flex flex="1">
        {isMultiple &&
          children.map(
            (c, index) =>
              index === currentIndex && (
                <Flex flexBasis="100%" h="100%">
                  {c}
                </Flex>
              )
          )}
      </Flex>
      <Row space={space['0.5']} justifyContent="center">
        {new Array((isMultiple && children?.length) || 0)
          .fill(0)
          .map((_, i) => (
            <CircleIcon
              size="xs"
              stroke="primary.900"
              strokeWidth="2"
              color={i === currentIndex ? 'primary.900' : 'transparent'}
            />
          ))}
      </Row>
      <Row justifyContent={'space-between'}>
        <Button
          variant={'link'}
          onPress={() => {
            let i = isMultiple ? children.length - 1 : 0
            setCurrentIndex(i)
            onSkip && onSkip()
          }}>
          Überspringen
        </Button>
        <Button
          variant={'link'}
          onPress={() => {
            let i =
              currentIndex < (isMultiple && children?.length - 1)
                ? currentIndex + 1
                : loop
                ? 0
                : currentIndex
            setCurrentIndex(i)

            onNext && onNext(i)
          }}>
          Weiter
        </Button>
      </Row>
    </Flex>
  )
}

export default ViewPager
