import { Box, Button, Heading, useBreakpointValue } from 'native-base';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Match, Pupil_Schooltype_Enum } from '../../gql/graphql';
import { useUserType } from '../../hooks/useApollo';
import { LFMatch } from '../../types/lernfair/Match';
import AlertMessage from '../../widgets/AlertMessage';
import HSection from '../../widgets/HSection';
import LearningPartner from '../../widgets/LearningPartner';

type MatchesProps = {
    activeMatches: Match[];
    inactiveMatches: Match[];
    showDissolveMatchModal: (match: Match) => void;
};

const Matches: React.FC<MatchesProps> = ({ activeMatches, inactiveMatches, showDissolveMatchModal }) => {
    const { t } = useTranslation();
    const userType = useUserType();

    const cardGridWidth = useBreakpointValue({
        base: '80%',
        lg: '46%',
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
                <Box width={cardGridWidth} key={match.id}>
                    <LearningPartner
                        key={index}
                        name={getMatchPartnerName(match)}
                        subjects={match?.subjectsFormatted}
                        schooltype={match?.pupil?.schooltype === Pupil_Schooltype_Enum.Other ? undefined : match?.pupil?.schooltype}
                        grade={match?.pupil?.grade ? match?.pupil?.grade : ''}
                        isStudent={!!match?.student?.isStudent}
                        isPupil={!!match?.pupil?.isPupil}
                        isDissolved={match?.dissolved}
                    />
                </Box>
            );
        },
        [getMatchPartnerName, showDissolveMatchModal]
    );

    return (
        <>
            <Heading>{t('matching.shared.activeMatches')}</Heading>
            <HSection>
                {activeMatches?.length > 0 ? (
                    activeMatches.map((match: Match, index: number) => renderMatch(match, index))
                ) : (
                    <AlertMessage content={t('matching.request.check.noMatches')} />
                )}
            </HSection>
            <Heading mt={headingMarginTop}>{t('matching.shared.inactiveMatches')}</Heading>
            <HSection>
                {inactiveMatches?.length > 0 ? (
                    inactiveMatches.map((match: Match, index: number) => renderMatch(match, index))
                ) : (
                    <AlertMessage content={t('matching.request.check.noDissolvedMatches')} />
                )}
            </HSection>
        </>
    );
};

export default Matches;
