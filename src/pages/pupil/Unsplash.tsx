import {
  View,
  Text,
  VStack,
  Row,
  Button,
  Image,
  ScrollView,
  Box
} from 'native-base'
import { useCallback, useState } from 'react'
import { Pressable } from 'react-native'
import TextInput from '../../components/TextInput'
import TwoColGrid from '../../widgets/TwoColGrid'

type Props = {
  onPhotoSelected: (photo: string) => any
}

const Unsplash: React.FC<Props> = ({ onPhotoSelected }) => {
  const [searchString, setSearchString] = useState<string>()

  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState<string>('')

  const search = useCallback(async () => {
    const data = await fetch(
      `https://api.unsplash.com/search/photos?per_page=20&query=${searchString}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH}`
        }
      }
    )
    const res = await data.json()
    setPhotos(res.results)
  }, [searchString])

  const pickPhoto = useCallback(() => {
    onPhotoSelected && onPhotoSelected(selectedPhoto)
  }, [onPhotoSelected, selectedPhoto])

  return (
    <VStack flex="1">
      <Row>
        <TextInput onChangeText={setSearchString} />
        <Button onPress={search}></Button>
        <Button onPress={pickPhoto} isDisabled={!selectedPhoto}>
          Wählen
        </Button>
      </Row>
      <View overflowY={'scroll'} flex="1">
        <TwoColGrid>
          {photos?.map((photo: any) => (
            <Pressable onPress={() => setSelectedPhoto(photo.urls.regular)}>
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
      </View>
    </VStack>
  )
}
export default Unsplash
