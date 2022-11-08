import { HStack, Button, ChevronLeftIcon, ChevronRightIcon } from 'native-base'
import { useMemo } from 'react'

type Props = {
  currentIndex: number
  onPrev: () => any
  onNext: () => any
  onSelectIndex: (index: number) => any
}

const Pagination: React.FC<Props> = ({
  currentIndex,
  onPrev,
  onNext,
  onSelectIndex
}) => {
  const startingPoint = useMemo(
    () => (currentIndex - 2 < 0 ? 1 : currentIndex - 2 || 1),
    [currentIndex]
  )

  return (
    <HStack justifyContent={'center'}>
      {currentIndex > 0 && (
        <Button onPress={onPrev}>
          <ChevronLeftIcon />
        </Button>
      )}

      {new Array(5).fill(0).map((_, index) => (
        <Button
          onPress={() => onSelectIndex(index + startingPoint)}
          variant="link"
          _text={{
            fontWeight: index == currentIndex - 1 ? 'bold' : 'normal'
          }}>{`${index + startingPoint}`}</Button>
      ))}

      <Button onPress={onNext}>
        <ChevronRightIcon />
      </Button>
    </HStack>
  )
}
export default Pagination
