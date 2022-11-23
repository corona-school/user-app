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

  const search = useCallback(async () => {
    setIsLoading(true)

    const data = await fetch(
      `https://api.unsplash.com/search/photos?query=${lastSearch}&page=${pageIndex}&per_page=20`,
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
  }, [lastSearch, pageIndex])

  const pickPhoto = useCallback(() => {
    onPhotoSelected && onPhotoSelected(selectedPhoto)
    setSelectedPhoto('')
  }, [onPhotoSelected, selectedPhoto])

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
        {(photos.length > 0 && (
          <VStack pb={'72px'} marginX={space['1']}>
            <Heading>Seite {pageIndex}</Heading>
            <Row flex="1" flexWrap={'wrap'} marginX={-space['0.5']}>
              {photos?.map((photo: any) => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    selectedPhoto === photo.urls.regular
                      ? setSelectedPhoto('')
                      : setSelectedPhoto(photo.urls.regular)
                  }>
                  <Column
                    flex={{ base: '50%', lg: '25%' }}
                    padding={space['0.5']}>
                    <AspectRatio ratio={16 / 9} w="100%">
                      <>
                        <Image src={photo.urls.small} height="100%" />
                        {selectedPhoto === photo.urls.regular && (
                          <Box
                            position={'absolute'}
                            w="100%"
                            h="100%"
                            bgColor="primary.900"
                            opacity={0.8}></Box>
                        )}
                      </>
                    </AspectRatio>
                  </Column>
                </TouchableWithoutFeedback>
              ))}
            </Row>

            <Pagination
              currentIndex={pageIndex}
              onPrev={() => {
                setPageIndex(prev => prev - 1)
                search()
              }}
              onNext={() => {
                setPageIndex(prev => prev + 1)
                search()
              }}
              onSelectIndex={index => {
                setPageIndex(index)
                search()
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
