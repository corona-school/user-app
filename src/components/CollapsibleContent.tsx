import {
  ChevronDownIcon,
  ChevronUpIcon,
  Heading,
  Pressable,
  Row,
  useTheme,
  VStack
} from 'native-base'
import { ReactNode, useMemo } from 'react'

type Props = {
  isOpen?: boolean
  children: ReactNode | ReactNode[]
  header?: ReactNode | ReactNode[]
  onPressHeader?: () => any
}

const CollapsibleContent: React.FC<Props> = ({
  children,
  isOpen,
  header,
  onPressHeader
}) => {
  const { space, colors } = useTheme()
  const textColor = useMemo(() => (isOpen ? 'lightText' : 'darkText'), [isOpen])
  const iconColor = useMemo(
    () => (isOpen ? 'lightText' : 'primary.900'),
    [isOpen]
  )

  return (
    <VStack>
      {header || (
        <Pressable onPress={onPressHeader}>
          <Row
            alignItems="center"
            borderBottomWidth="1"
            borderColor={colors['primary']['500']}>
            <Heading
              fontSize="md"
              pt={space['1']}
              pb={space['0.5']}
              flex="1"
              color={textColor}>
              Weitere Details
            </Heading>
            {isOpen ? (
              <ChevronUpIcon color={iconColor} />
            ) : (
              <ChevronDownIcon color={iconColor} />
            )}
          </Row>
        </Pressable>
      )}
      {isOpen && children}
    </VStack>
  )
}
export default CollapsibleContent
