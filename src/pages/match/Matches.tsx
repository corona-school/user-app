import { Box, Flex, Heading, useBreakpointValue, useTheme, VStack } from 'native-base';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Match, Pupil_Schooltype_Enum } from '../../gql/graphql';
import { useUserType } from '../../hooks/useApollo';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import AlertMessage from '../../widgets/AlertMessage';
import LearningPartner from '../../widgets/LearningPartner';
import { getGradeLabel } from '../../Utility';

type MatchesProps = {
    activeMatches: Match[];
};

interface MatchCardProps {
    match: Match;
}

export const MatchCard = ({ match }: MatchCardProps) => {
    const userType = useUserType();
    const CardGrid = useBreakpointValue({
        base: '100%',
        lg: '50%',
    });

    const getMatchPartnerName = useCallback(
        (match: Match): string => {
            if (userType === 'student') return `${match?.pupil?.firstname} ${match?.pupil?.lastname}`;
            return `${match?.student?.firstname} ${match?.student?.lastname}`;
        },
        [userType]
    );

    return (
        <Box width={CardGrid} paddingRight="10px" marginBottom="10px" key={match.id}>
            <LearningPartner
                matchId={match.id}
                name={getMatchPartnerName(match)}
                subjects={match?.subjectsFormatted}
                schooltype={match?.pupil?.schooltype === Pupil_Schooltype_Enum.Other ? undefined : match?.pupil?.schooltype}
                grade={match?.pupil?.gradeAsInt ? getGradeLabel(match.pupil.gradeAsInt) : undefined}
                isDissolved={match?.dissolved}
            />
        </Box>
    );
};

const Matches: React.FC<MatchesProps> = ({ activeMatches }) => {
    const { t } = useTranslation();
    const { isMobile } = useLayoutHelper();
    const { space } = useTheme();

    return (
        <>
            <VStack space={space['2']}>
                <VStack space={space['1']}>
                    <Heading>{t('matching.shared.activeMatches')}</Heading>
                    <Flex direction={isMobile ? 'column' : 'row'} flexWrap="wrap">
                        {activeMatches?.length > 0 ? (
                            activeMatches.map((match: Match) => <MatchCard key={match.id} match={match} />)
                        ) : (
                            <AlertMessage content={t('matching.request.check.noMatches')} />
                        )}
                    </Flex>
                </VStack>
            </VStack>
        </>
    );
};

export default Matches;
