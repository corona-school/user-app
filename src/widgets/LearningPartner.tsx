import { View, Text, Row, useTheme, VStack, Button, Column } from 'native-base';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Tag from '../components/Tag';
import { Subject } from '../gql/graphql';

type LearningPartnerProps = {
    name: string;
    subjects: Subject[];
    schooltype?: string;
    schoolclass?: number;
    isDark?: boolean;
    button?: ReactNode;
    status?: string;
    contactMail?: string;
    meetingId?: string;
};

const LearningPartner: React.FC<LearningPartnerProps> = ({
    name,
    subjects,
    schooltype,
    schoolclass,
    isDark = false,
    button,
    status,
    contactMail,
    meetingId,
}) => {
    const { space } = useTheme();
    const { t } = useTranslation();

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
                            <Text color={isDark ? 'lightText' : 'primary.900'}>
                                <Text bold>{t('matching.shared.subjects')}</Text>
                            </Text>
                            {subjects.map((sub) => (
                                <Tag
                                    text={t(`lernfair.subjects.${sub.name}` as unknown as TemplateStringsArray)}
                                    variant="secondary-light"
                                    marginBottom={0}
                                    key={sub.name}
                                />
                            ))}
                        </Row>
                    )}

                    {schooltype && (
                        <Row flexWrap={'wrap'} space="5px" alignItems="center">
                            <Text color={isDark ? 'lightText' : 'primary.900'}>
                                <Text bold>{t('matching.shared.schooltype')}</Text> {t(`lernfair.schooltypes.${schooltype}` as unknown as TemplateStringsArray)}
                            </Text>
                        </Row>
                    )}

                    {schoolclass && (
                        <Row flexWrap={'wrap'} space="5px" alignItems="center">
                            <Text color={isDark ? 'lightText' : 'primary.900'}>
                                <Text bold>{t('matching.shared.class')}</Text> {schoolclass}
                            </Text>
                        </Row>
                    )}

                    {status && (
                        <Row flexWrap={'wrap'} space="5px" alignItems="center">
                            <Text color={isDark ? 'lightText' : 'primary.900'}>
                                <Text bold>{t('matching.shared.state')}</Text> {status}
                            </Text>
                        </Row>
                    )}

                    {button && (
                        <Column mt={space['1']} space={space['1']}>
                            {meetingId && (
                                <Button space={2} onPress={() => window.open(`https://meet.jit.si/CoronaSchool-${meetingId}`, '_blank')}>
                                    {t('matching.shared.videochat')}
                                </Button>
                            )}
                            {contactMail && <Button onPress={() => (window.location.href = `mailto:${contactMail}`)}>{t('matching.shared.contact')}</Button>}
                            {button}
                        </Column>
                    )}
                </VStack>
            </Card>
        </View>
    );
};
export default LearningPartner;
