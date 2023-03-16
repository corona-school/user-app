import { Box, Button, Heading, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useUserType } from '../../hooks/useApollo';
import { LFMatch } from '../../types/lernfair/Match';
import AlertMessage from '../../widgets/AlertMessage';
import HSection from '../../widgets/HSection';
import LearningPartner from '../../widgets/LearningPartner';

type MatchesProps = {
    activeMatches: LFMatch[];
    inactiveMatches: LFMatch[];
    showDissolveMatchModal: (match: LFMatch) => void;
};

const Matches: React.FC<MatchesProps> = ({ activeMatches, inactiveMatches, showDissolveMatchModal }) => {
    const { t } = useTranslation();
    const userType = useUserType();

    const CardGrid = useBreakpointValue({
        base: '80%',
        lg: '46%',
    });

    const MarginTop = useBreakpointValue({
        base: '10px',
        lg: '30px',
    });

    const getMatchPartnerName = (match: LFMatch): string => {
        if (userType === 'student') return match?.pupil?.firstname;
        return `${match?.student?.firstname} ${match?.student?.lastname}`;
    };

    const renderMatch = (match: LFMatch, index: number) => {
        return (
            <Box width={CardGrid} key={match.id}>
                <LearningPartner
                    key={index}
                    isDark={match?.dissolved ? false : true}
                    name={getMatchPartnerName(match)}
                    subjects={match?.subjectsFormatted}
                    schooltype={match?.pupil?.schooltype}
                    schoolclass={match?.pupil?.grade}
                    status={match?.dissolved ? t('matching.shared.inactive') : t('matching.shared.active')}
                    button={
                        !match.dissolved && (
                            <Button variant="outlinelight" onPress={() => showDissolveMatchModal(match)}>
                                {t('dashboard.helpers.buttons.solveMatch')}
                            </Button>
                        )
                    }
                    contactMail={match?.studentEmail}
                    meetingId={match?.uuid}
                />
            </Box>
        );
    };

    return (
        <>
            <Heading>{t('matching.shared.activeMatches')}</Heading>
            <HSection>
                {activeMatches?.length > 0 ? (
                    activeMatches.map((match: LFMatch, index: number) => renderMatch(match, index))
                ) : (
                    <AlertMessage content={t('matching.request.check.noMatches')} />
                )}
            </HSection>
            <Heading mt={MarginTop}>{t('matching.shared.inactiveMatches')}</Heading>
            <HSection>
                {inactiveMatches?.length > 0 ? (
                    inactiveMatches.map((match: LFMatch, index: number) => renderMatch(match, index))
                ) : (
                    <AlertMessage content={t('matching.request.check.noMatches')} />
                )}
            </HSection>
        </>
    );
};

export default Matches;
