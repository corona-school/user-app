import { View, Text, Row, useTheme, VStack, Button, Column } from 'native-base';
import { ReactNode } from 'react';
import Card from '../components/Card';
import Tag from '../components/Tag';
import { LFSubject } from '../types/lernfair/Subject';

type Props = {
    name: string;
    subjects: LFSubject[];
    schooltype?: string;
    schoolclass?: number;
    isDark?: boolean;
    button?: ReactNode;
    status?: string;
    contactMail?: string;
    meetingId?: string;
};

const LearningPartner: React.FC<Props> = ({ name, subjects, schooltype, schoolclass, isDark = false, button, status, contactMail, meetingId }) => {
    const { space } = useTheme();

    return (
        <View marginBottom={space['0.5']}>
            <Card flexibleWidth variant={isDark ? 'dark' : 'normal'} padding={space['1.5']}>
                <VStack space={space['0.5']}>
                    {name && (
                        <Text bold fontSize={'md'} mb={space['0.5']} color={isDark ? 'lightText' : 'primary.900'}>
                            {name}
                        </Text>
                    )}

                    {subjects && (
                        <Row flexWrap={'wrap'} space="5px" alignItems="center">
                            <Text color="lightText">
                                <Text bold>Fächer:</Text>
                            </Text>
                            {subjects.map((sub: LFSubject) => (
                                <Tag text={sub.name} variant="secondary-light" marginBottom={0} />
                            ))}
                        </Row>
                    )}

                    {schooltype && (
                        <Row flexWrap={'wrap'} space="5px" alignItems="center">
                            <Text color={isDark ? 'lightText' : 'primary.900'}>
                                <Text bold>Schulform:</Text> {schooltype}
                            </Text>
                        </Row>
                    )}

                    {schoolclass && (
                        <Row flexWrap={'wrap'} space="5px" alignItems="center">
                            <Text color={isDark ? 'lightText' : 'primary.900'}>
                                <Text bold>Klasse:</Text> {schoolclass}
                            </Text>
                        </Row>
                    )}

                    {status && (
                        <Row flexWrap={'wrap'} space="5px" alignItems="center">
                            <Text color={isDark ? 'lightText' : 'primary.900'}>
                                <Text bold>Status:</Text> {status}
                            </Text>
                        </Row>
                    )}

                    {button && (
                        <Column mt={space['1']} space={space['1']}>
                            {meetingId && (
                                <Button space={2} onPress={() => window.open(`https://meet.jit.si/CoronaSchool-${meetingId}`, '_blank')}>
                                    Videochat
                                </Button>
                            )}
                            {contactMail && <Button onPress={() => (window.location.href = `mailto:${contactMail}`)}>Kontaktieren</Button>}
                            {button}
                        </Column>
                    )}
                </VStack>
            </Card>
        </View>
    );
};
export default LearningPartner;
