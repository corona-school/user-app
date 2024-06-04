import { Box, Button, Heading, HStack, Stack, Text, useTheme, VStack } from 'native-base';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil_120.svg';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student_120.svg';
import Tag from '../../components/Tag';
import { Pupil, Pupil_Schooltype_Enum, Student, Student_State_Enum } from '../../gql/graphql';
import { getGradeLabel } from '../../Utility';

type MatchPartnerProps = {
    partner: Pupil | Student;
    isPupil?: boolean;
};
const MatchPartner: React.FC<MatchPartnerProps> = ({ partner, isPupil = false }) => {
    const [showMore, setShowMore] = useState<boolean>(false);
    const { space } = useTheme();
    const { t } = useTranslation();

    const state = useMemo(() => {
        if (partner.state && partner.state !== Student_State_Enum.Other) return t(`lernfair.states.${partner.state}`);
        return undefined;
    }, [partner.state, t]);

    const school = useMemo(() => {
        if ('schooltype' in partner && partner.schooltype !== Pupil_Schooltype_Enum.Other) return t(`lernfair.schooltypes.${partner.schooltype}`);
        return undefined;
    }, [partner, t]);

    const matchPartnerInfos = useMemo(() => {
        let strings: string[] = [];
        if (school) strings.push(school);
        if ('gradeAsInt' in partner && partner.gradeAsInt) strings.push(getGradeLabel(partner.gradeAsInt));
        if (state) strings.push(state);
        return strings.join(' • ');
    }, [partner, school, state]);

    return (
        <Stack space={space['1']} justifyContent="center" alignItems="center">
            {isPupil ? <PupilAvatar /> : <StudentAvatar />}
            <Heading>{`${partner.firstname} ${partner.lastname}`}</Heading>
            <Text>{matchPartnerInfos}</Text>
            <HStack space={space['1']}>
                {partner.subjectsFormatted.map((subject) => (
                    <Tag text={subject.name} />
                ))}
            </HStack>
            <Box maxW="500">
                <VStack>
                    <Text ellipsizeMode="tail" italic numberOfLines={showMore ? 50 : 2} textAlign="center">
                        {partner.aboutMe}
                    </Text>
                </VStack>
                {partner.aboutMe.length > 500 &&
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
