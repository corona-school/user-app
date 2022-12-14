import { gql, useQuery } from '@apollo/client'
import {
  View,
  Text,
  VStack,
  Button,
  Image,
  Box,
  Flex,
  useTheme,
  Heading,
  Row,
  ArrowBackIcon,
  Column,
  AspectRatio
} from 'native-base'
import { useCallback, useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import CenterLoadingSpinner from '../components/CenterLoadingSpinner'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'

type Props = {
  onClose: () => any
}

const Tags: React.FC<Props> = ({ onClose }) => {
  const { space } = useTheme()

  const [isLoading, setIsLoading] = useState<boolean>()
  const [searchResults, setSearchResults] = useState([])
  const [tags, setTags] = useState<string>('')

  const [lastSearch, setLastSearch] = useState<string>('')
  // const [getTags] = useQuery(gql`query ($search: String!){
  //   course_tags(take: 50, skip: 0, where: {name: {contains: $search}}) {
  // }`)

  const search = useCallback(async () => {
    setIsLoading(true)
    // const res = await getTags()
    setIsLoading(false)
  }, [])

  if (isLoading) return <CenterLoadingSpinner />

  return (
    <VStack flex="1" overflowY="scroll" h="100%">
      <Row w="100%" paddingX={space['1']} paddingY={space['0.5']}>
        <Button padding={space['1']} onPress={onClose}>
          <ArrowBackIcon />
        </Button>
        <SearchBar
          onSearch={s => search()}
          onChangeText={setLastSearch}
          value={lastSearch}
        />
      </Row>
      <View overflowY={'scroll'} flex="1">
        {(searchResults.length > 0 && (
          <VStack pb={'72px'} marginX={space['1']}>
            <Row flex="1" flexWrap={'wrap'} marginX={-space['0.5']}>
              {searchResults?.map((photo: any) => (
                <TouchableWithoutFeedback onPress={() => null}>
                  <Column
                    flex={{ base: '50%', lg: '25%' }}
                    padding={space['0.5']}></Column>
                </TouchableWithoutFeedback>
              ))}
            </Row>
          </VStack>
        )) || (
          <Flex flex="1" justifyContent="center" alignItems="center">
            <Text>Keine Suchergebnisse.</Text>
          </Flex>
        )}
      </View>
    </VStack>
  )
}
export default Tags
