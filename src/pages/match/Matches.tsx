import { Box, Flex, Heading, useBreakpointValue, useTheme, VStack } from 'native-base';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Match, Pupil_Schooltype_Enum } from '../../gql/graphql';
import { useUserType } from '../../hooks/useApollo';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import AlertMessage from '../../widgets/AlertMessage';
import LearningPartner from '../../widgets/LearningPartner';

type MatchesProps = {
    activeMatches: Match[];
    inactiveMatches: Match[];
};

const Matches: React.FC<MatchesProps> = ({ activeMatches, inactiveMatches }) => {
    const { t } = useTranslation();
    const userType = useUserType();
    const { isMobile } = useLayoutHelper();
    const { space } = useTheme();

    const CardGrid = useBreakpointValue({
        base: '100%',
        lg: '50%',
    });

    const headingMarginTop = useBreakpointValue({
        base: '10px',
        lg: '30px',
    });

    const getMatchPartnerName = useCallback(
        (match: Match): string => {
            if (userType === 'student') return `${match?.pupil?.firstname} ${match?.pupil?.lastname}`;
            return `${match?.student?.firstname} ${match?.student?.lastname}`;
        },
        [userType]
    );

    const renderMatch = useCallback(
        (match: Match, index: number) => {
            return (
                <Box width={CardGrid} paddingRight="10px" marginBottom="10px" key={match.id}>
                    <LearningPartner
                        key={index}
                        matchId={match.id}
                        name={getMatchPartnerName(match)}
                        subjects={match?.subjectsFormatted}
                        schooltype={match?.pupil?.schooltype === Pupil_Schooltype_Enum.Other ? undefined : match?.pupil?.schooltype}
                        grade={match?.pupil?.grade ? match?.pupil?.grade : ''}
                        isDissolved={match?.dissolved}
                    />
                </Box>
            );
        },
        [CardGrid, getMatchPartnerName]
    );

    return (
        <>
            <VStack space={space['2']}>
                <VStack space={space['1']}>
                    <Heading>{t('matching.shared.activeMatches')}</Heading>
                    <Flex direction={isMobile ? 'column' : 'row'} flexWrap="wrap">
                        {activeMatches?.length > 0 ? (
                            activeMatches.map((match: Match, index: number) => renderMatch(match, index))
                        ) : (
                            <AlertMessage content={t('matching.request.check.noMatches')} />
                        )}
                    </Flex>
                </VStack>
                <VStack space={space['0.5']}>
                    <Heading mt={headingMarginTop}>{t('matching.shared.inactiveMatches')}</Heading>

                    <Flex direction="row" flexWrap="wrap">
                        {inactiveMatches?.length > 0 ? (
                            inactiveMatches.map((match: Match, index: number) => renderMatch(match, index))
                        ) : (
                            <AlertMessage content={t('matching.request.check.noDissolvedMatches')} />
                        )}
                    </Flex>
                </VStack>
            </VStack>
        </>
    );
};

export default Matches;
