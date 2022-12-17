import { View, Row, Column, Heading, InfoIcon, Box, Pressable, Text, Container, CloseIcon, useTheme } from 'native-base';
import { ReactNode, useContext } from 'react';
import { ModalContext } from './FullPageModal';

type Props = {
    title: string;
    children: ReactNode;
    help?: string;
    helpHeadline?: string;
    isSpace?: boolean;
};

const ProfileSettingRow: React.FC<Props> = ({ title, children, help, helpHeadline, isSpace = true }) => {
    const { setShow, setContent, setVariant } = useContext(ModalContext);
    const { space } = useTheme();

    return (
        <View paddingY={isSpace ? 3 : 0}>
            <Row>
                <Column mb={2}>
                    <Heading fontSize="lg">{title}</Heading>
                </Column>
                {help && (
                    <Pressable
                        onPress={() => {
                            setVariant('light');
                            setContent(
                                <Container maxWidth="100%" padding={space['1']}>
                                    <Box marginBottom={space['2']}>
                                        <Pressable
                                            onPress={() => {
                                                setShow(false);
                                            }}
                                        >
                                            <CloseIcon color="primary.800" />
                                        </Pressable>
                                    </Box>
                                    <Box flexDirection="row" alignItems="center" marginBottom={3}>
                                        <InfoIcon marginRight={3} size="30" color="danger.100" />
                                        <Heading>{helpHeadline}</Heading>
                                    </Box>
                                    <Box paddingY={space['0.5']}>
                                        <Text marginBottom={space['0.5']}>{help}</Text>
                                    </Box>
                                </Container>
                            );
                            setShow(true);
                        }}
                    >
                        <Box marginLeft="10px" marginTop="3px" marginRight="10px">
                            <InfoIcon color="warning.100" />
                        </Box>
                    </Pressable>
                )}
            </Row>
            <Row paddingY={3} flexDirection="column">
                {children}
            </Row>
        </View>
    );
};
export default ProfileSettingRow;
