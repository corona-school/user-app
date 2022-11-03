import {
  View,
  Text,
  VStack,
  Button,
  Image,
  Box,
  Flex,
  useTheme,
  Spinner,
  Heading
} from 'native-base'
import { useCallback, useState } from 'react'
import { Pressable } from 'react-native'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import TwoColGrid from '../widgets/TwoColGrid'

type Props = {
  onPhotoSelected: (photo: string) => any
  onClose: () => any
}

const Unsplash: React.FC<Props> = ({ onPhotoSelected, onClose }) => {
  const { space } = useTheme()

  const [isLoading, setIsLoading] = useState<boolean>()
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState<string>('')
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [lastSearch, setLastSearch] = useState<string>('')

  const search = useCallback(
    async (s: string) => {
      setLastSearch(s)
      setIsLoading(true)

      const data = await fetch(
        `https://api.unsplash.com/search/photos?query=${s}&page=${pageIndex}&per_page=20`,
        {
          method: 'GET',
          headers: {
            Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH}`
          }
        }
      )
      const res = await data.json()
      setPhotos(res.results)
      setIsLoading(false)
    },
    [pageIndex]
  )

  const pickPhoto = useCallback(() => {
    onPhotoSelected && onPhotoSelected(selectedPhoto)
    setSelectedPhoto('')
  }, [onPhotoSelected, selectedPhoto])

  if (isLoading)
    return (
      <Flex flex="1" justifyContent="center" alignItems="center" h="100%">
        <Spinner />
      </Flex>
    )

  return (
    <VStack flex="1" overflowY="scroll" h="100%">
      <Box paddingX={space['1']} paddingY={space['0.5']}>
        <SearchBar showBack onSearch={s => search(s)} />
      </Box>
      <View overflowY={'scroll'} flex="1">
        {(photos.length > 0 && (
          <VStack pb={'72px'} marginX={space['1']}>
            <Heading>Seite {pageIndex}</Heading>
            <TwoColGrid>
              {photos?.map((photo: any) => (
                <Pressable
                  onPress={() =>
                    selectedPhoto === photo.urls.regular
                      ? setSelectedPhoto('')
                      : setSelectedPhoto(photo.urls.regular)
                  }>
                  <Box>
                    <Image src={photo.urls.small} width={'100%'} minH={200} />
                    {selectedPhoto === photo.urls.regular && (
                      <Box
                        position={'absolute'}
                        w="100%"
                        h="100%"
                        bgColor="primary.900"
                        opacity={0.8}>
                        {' '}
                      </Box>
                    )}
                  </Box>
                </Pressable>
              ))}
            </TwoColGrid>
            <Pagination
              currentIndex={pageIndex}
              onPrev={() => {
                setPageIndex(prev => prev - 1)
                search(lastSearch)
              }}
              onNext={() => {
                setPageIndex(prev => prev + 1)
                search(lastSearch)
              }}
              onSelectIndex={index => {
                setPageIndex(index)
                search(lastSearch)
              }}
            />
          </VStack>
        )) || (
          <Flex flex="1" justifyContent="center" alignItems="center">
            <Text>Keine Suchergebnisse.</Text>
          </Flex>
        )}
        {selectedPhoto && (
          <Box
            bgColor="primary.900"
            w="100%"
            h="64px"
            position={'fixed'}
            bottom="0"
            alignItems={'flex-end'}
            justifyContent={'center'}
            paddingRight={space['0.5']}>
            <Button onPress={pickPhoto} isDisabled={!selectedPhoto}>
              Wählen
            </Button>
          </Box>
        )}
      </View>
    </VStack>
  )
}
export default Unsplash
