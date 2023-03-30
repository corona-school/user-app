import { Box, Flex, Heading, useBreakpointValue, useTheme, VStack } from 'native-base';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Match, Pupil_Schooltype_Enum } from '../../gql/graphql';
import { useUserType } from '../../hooks/useApollo';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { LFMatch } from '../../types/lernfair/Match';
import AlertMessage from '../../widgets/AlertMessage';
import LearningPartner from '../../widgets/LearningPartner';

type MatchesProps = {
    activeMatches: Match[];
    inactiveMatches: Match[];
    showDissolveMatchModal: (match: Match) => void;
};

const Matches: React.FC<MatchesProps> = ({ activeMatches, inactiveMatches, showDissolveMatchModal }) => {
    const { t } = useTranslation();
    const userType = useUserType();
    const { isMobile } = useLayoutHelper();
    const { space } = useTheme();

    const cardGridWidth = useBreakpointValue({
        base: '100%',
        lg: '50%',
    });

    const headingMarginTop = useBreakpointValue({
        base: '10px',
        lg: '30px',
    });

    const getMatchPartnerName = useCallback(
        (match: LFMatch): string => {
            if (userType === 'student') return `${match?.pupil?.firstname} ${match?.pupil?.lastname}`;
            return `${match?.student?.firstname} ${match?.student?.lastname}`;
        },
        [userType]
    );

    const renderMatch = useCallback(
        (match: Match, index: number) => {
            return (
                <Box key={match.id} width={cardGridWidth} paddingY={space['0.5']} paddingRight={isMobile ? 0 : space['1']}>
                    <LearningPartner
                        key={index}
                        name={getMatchPartnerName(match)}
                        subjects={match?.subjectsFormatted}
                        schooltype={match?.pupil?.schooltype === Pupil_Schooltype_Enum.Other ? undefined : match?.pupil?.schooltype}
                        grade={match?.pupil?.grade ? match?.pupil?.grade : ''}
                        isDissolved={match?.dissolved}
                    />
                </Box>
            );
        },
        [getMatchPartnerName, showDissolveMatchModal]
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
