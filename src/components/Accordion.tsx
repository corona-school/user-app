import {
  View,
  Pressable,
  Heading,
  Box,
  useTheme,
  Row,
  Column,
  Icon,
  ChevronDownIcon,
  PresenceTransition
} from 'native-base'
import { ReactNode, useState } from 'react'
import CSSWrapper from './CSSWrapper'

import '../web/scss/components/Accordion.scss'

type Props = {
  title: string
  children: ReactNode
}

const Accordion: React.FC<Props> = ({ title, children }) => {
  const { space } = useTheme()
  const [isActive, setIsActive] = useState(false)

  return (
    <View marginBottom={space['1']}>
      <Box>
        <CSSWrapper
          className={
            isActive
              ? 'accordion__item-header accordion__item-header--open'
              : 'accordion__item-header'
          }>
          <Pressable onPress={() => setIsActive(!isActive)}>
            <Row
              paddingX={space['1.5']}
              paddingY={space['1']}
              borderRadius={10}
              borderBottomRadius={isActive ? 0 : ''}
              backgroundColor={isActive ? 'primary.800' : 'primary.200'}
              justifyContent="space-between"
              width="100%"
              alignItems="center">
              <Column>
                <Heading
                  maxWidth="200"
                  fontSize="sm"
                  color={isActive ? 'white' : 'primary.900'}>
                  {title}
                </Heading>
              </Column>
              <Column>
                <PresenceTransition
                  visible={isActive}
                  initial={{
                    rotate: '0deg'
                  }}
                  animate={{
                    rotate: '180deg',
                    transition: {
                      duration: 250
                    }
                  }}>
                  <Box
                    width="28px"
                    height="28px"
                    backgroundColor={isActive ? 'primary.100' : 'primary.800'}
                    justifyContent="center"
                    alignItems="center"
                    padding={space['0.5']}
                    borderRadius="50%">
                    <ChevronDownIcon
                      color={isActive ? 'primary.900' : 'white'}
                    />
                  </Box>
                </PresenceTransition>
              </Column>
            </Row>
          </Pressable>
        </CSSWrapper>
      </Box>
      <CSSWrapper
        className={
          isActive
            ? 'accordion__item-content accordion__item-content--open'
            : 'accordion__item-content'
        }>
        <Box
          backgroundColor="primary.800"
          paddingBottom={space['1.5']}
          paddingX={space['1.5']}
          borderBottomLeftRadius={10}
          borderBottomRightRadius={10}>
          {children}
        </Box>
      </CSSWrapper>
    </View>
  )
}
export default Accordion
