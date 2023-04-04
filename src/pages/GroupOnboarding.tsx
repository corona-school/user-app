import { Box, Circle, FlatList, HStack, Image, Modal, View, useTheme } from 'native-base';
import { Button, Card, Heading, Stack, Text, useBreakpointValue } from 'native-base';
import IconGroup from '../assets/icons/Icon_Gruppe.svg';
import LFImageGroupOnboarding from '../assets/images/course/group-onboarding.png';
import LFImageGroupHorizontal from '../assets/images/course/group-onboarding-horizontal.png';
import { useState } from 'react';
import CourseConfirmationModal from '../modals/CourseConfirmationModal';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const courseDescriptions = [
    {
        type: 'course',
        desc: i18next.t('introduction.description.course'),
    },
    {
        type: 'language',
        desc: i18next.t('introduction.description.language'),
    },
    {
        type: 'focus',
        desc: i18next.t('introduction.description.focus'),
    },
];

const GroupOnboarding: React.FC = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const isMobile = useBreakpointValue({ base: true, lg: false });

    return (
        <>
            <View px={'10'} maxW="1450px">
                <Card bgColor="primary.100">
                    {!isMobile ? (
                        <Stack space="5" direction="row">
                            <Stack maxW="50%" p="10" space={space['3']}>
                                <IconGroup />
                                <Heading>{t('introduction.groupCourses')}</Heading>
                                <Text ellipsizeMode="tail" numberOfLines={2}>
                                    {t('introduction.courseTypes')}
                                </Text>

                                <FlatList
                                    data={courseDescriptions}
                                    renderItem={({ item }) => (
                                        <HStack space={space['1']} justifyContent="space-between" mb={space['1']}>
                                            <Circle backgroundColor="black" size="4px" mt={2} />
                                            <Text numberOfLines={10}>{item.desc}</Text>
                                        </HStack>
                                    )}
                                />

                                <Stack space={space['1']}>
                                    <Button onPress={() => setIsModalOpen(true)}>{t('introduction.becomeAnInstructor')}</Button>
                                    <Button variant="outline">{t('introduction.talkWithTeam')}</Button>
                                    <Button variant="outline">{t('introduction.moreInfos')}</Button>
                                </Stack>
                            </Stack>

                            <Box w="800px" height="full" display="block" position="relative" left={0} right={0} top={-20}>
                                <Image
                                    position="absolute"
                                    width="90%"
                                    height="110%"
                                    bgColor="gray.300"
                                    alt={'group'}
                                    source={{
                                        uri: LFImageGroupOnboarding,
                                    }}
                                />

                                <Box position="absolute" top={800} left={450}>
                                    <Text italic textAlign="end" color="primary.900" w="200px" zIndex={1} position="absolute">
                                        {t('introduction.imageText')}
                                    </Text>
                                </Box>
                            </Box>
                        </Stack>
                    ) : (
                        <Stack space="1" direction="column">
                            <Box w="120%" height="20%" position="relative" display="block" top={-20} left={-20}>
                                <Image left={0} right={0} top={0} height="100%" bgColor="gray.300" alt={'group'} source={{ uri: LFImageGroupHorizontal }} />
                                <Box position="absolute" top={120} left={100}>
                                    <Text italic textAlign="end" color="primary.900" w="200px" zIndex={1}>
                                        {t('introduction.imageText')}
                                    </Text>
                                </Box>
                            </Box>
                            <Stack maxW="full" px="2" space={space['1']}>
                                <IconGroup />
                                <Heading>{t('introduction.groupCourses')}</Heading>
                                <Text ellipsizeMode="tail" numberOfLines={2}>
                                    {t('introduction.courseTypes')}
                                </Text>

                                <FlatList
                                    data={courseDescriptions}
                                    renderItem={({ item }) => (
                                        <HStack space={space['1']} justifyContent="space-between" mb="1">
                                            <Circle backgroundColor="black" size="4px" mt={2} />
                                            <Text numberOfLines={10}>{item.desc}</Text>
                                        </HStack>
                                    )}
                                />
                                <Stack space={space['1']}>
                                    <Button onPress={() => setIsModalOpen(true)}>{t('introduction.becomeAnInstructor')}</Button>
                                    <Button variant="outline">{t('introduction.talkWithTeam')}</Button>
                                    <Button variant="outline">{t('introduction.moreInfos')}</Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    )}
                </Card>
            </View>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CourseConfirmationModal
                    headline={t('introduction.modal.headline')}
                    confirmButtonText={t('introduction.modal.button')}
                    description={t('introduction.modal.desc')}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={() => console.log('kursleiter')}
                />
            </Modal>
        </>
    );
};

export default GroupOnboarding;
