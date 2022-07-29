import { ReactNode } from 'react'
import { View, Text, Row, Box, Avatar, useTheme } from 'native-base'
import Card from '../components/Card'

type Props = {
    avatar?: string 
    name: string
    fach: ReactNode[]
    schulform: string
    klasse: number
}

const LearningPartner: React.FC<Props> = ( { avatar, name, fach, schulform, klasse } ) => {
    const { space } = useTheme()

    return (
        <View marginBottom={space['1']}>
            <Card flexibleWidth>
                <Row padding={space['1']}>
                    <Box marginRight={ space['1']}>
                        <Avatar source={ { uri: avatar }} />
                    </Box>
                    <Box>
                        { name && 
                            <Text bold fontSize={'md'}>
                                {name}
                            </Text>
                        }

                        { fach && 
                            <Text>
                                Fach: { fach.join(', ')}
                            </Text>
                        }
                    
                        { schulform && 
                            <Text>
                                Schulform: {schulform}
                            </Text>
                        }
                    
                        { klasse && 
                            <Text>
                                Klasse: {klasse}
                            </Text>
                        }
                    </Box>
                </Row>
            </Card>
        </View>
    )
}
export default LearningPartner