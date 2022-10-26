import {
  View,
  Text,
  VStack,
  Row,
  Button,
  Image,
  Box,
  Flex,
  useTheme,
  SearchIcon,
  Input,
  Spinner,
  Heading,
  ArrowBackIcon
} from 'native-base'
import { useCallback, useState } from 'react'
import { Pressable } from 'react-native'
import BackButton from '../components/BackButton'
import Pagination from '../components/Pagination'
import TwoColGrid from '../widgets/TwoColGrid'

type Props = {
  onPhotoSelected: (photo: string) => any
  onClose: () => any
}

const Unsplash: React.FC<Props> = ({ onPhotoSelected, onClose }) => {
  const { space } = useTheme()
  const [searchString, setSearchString] = useState<string>()

  const [isLoading, setIsLoading] = useState<boolean>()
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState<string>('')
  const [pageIndex, setPageIndex] = useState<number>(1)

  const search = useCallback(async () => {
    setIsLoading(true)

    const data = await fetch(
      `https://api.unsplash.com/search/photos?query=${searchString}&page=${pageIndex}&per_page=20`,
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
  }, [pageIndex, searchString])

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
      <Row paddingX={space['1']} paddingY={space['0.5']}>
        <Button padding={space['1']} onPress={onClose}>
          <ArrowBackIcon />
        </Button>
        <Input
          flex="1"
          onChangeText={setSearchString}
          placeholder="Suchbegriff eingeben"
        />
        <Button onPress={search} padding={space['1']}>
          <SearchIcon />
        </Button>
      </Row>
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
