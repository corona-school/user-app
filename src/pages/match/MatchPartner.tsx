import { Box, Button, Heading, HStack, Stack, Text, useTheme, VStack } from 'native-base';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil_120.svg';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student_120.svg';
import Tag from '../../components/Tag';
import { Subject } from '../../gql/graphql';

type MatchPartnerProps = {
    name: string;
    schooltype?: string;
    grade?: string;
    federalState: string;
    subjects: Subject[];
    aboutMe: string;
    isPupil: boolean;
};
const MatchPartner: React.FC<MatchPartnerProps> = ({ name, schooltype, grade, federalState, subjects, aboutMe, isPupil }) => {
    const [showMore, setShowMore] = useState<boolean>(false);
    const { space } = useTheme();
    const { t } = useTranslation();

    const matchPartnerInfos = useMemo(() => {
        let strings: string[] = [];
        schooltype && strings.push(schooltype);
        grade && strings.push(grade);
        federalState && strings.push(federalState);
        return strings.join(' • ');
    }, [federalState, grade, schooltype]);

    return (
        <Stack space={space['1']} justifyContent="center" alignItems="center">
            {isPupil ? <PupilAvatar /> : <StudentAvatar />}
            <Heading>{name}</Heading>
            <Text>{matchPartnerInfos}</Text>
            <HStack space={space['1']}>
                {subjects.map((subject) => (
                    <Tag text={subject.name} />
                ))}
            </HStack>
            <Box maxW="500">
                <VStack>
                    <Text ellipsizeMode="tail" italic numberOfLines={showMore ? 50 : 2} textAlign="center">
                        {aboutMe}
                    </Text>
                </VStack>
                {aboutMe.length > 500 &&
                    (!showMore ? (
                        <Button variant="link" onPress={() => setShowMore(true)} bold>
                            {t('matching.shared.showMore')}
                        </Button>
                    ) : (
                        <Button variant="link" onPress={() => setShowMore(false)} bold>
                            {t('matching.shared.showLess')}
                        </Button>
                    ))}
            </Box>
        </Stack>
    );
};

export default MatchPartner;
