import { VStack, useTheme, Heading, Column, Box } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { containsDAZ, DAZ } from '../../../types/subject';
import AlertMessage from '../../../widgets/AlertMessage';
import IconTagList from '../../../widgets/IconTagList';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import TwoColGrid from '../../../widgets/TwoColGrid';
import { YesNoSelector } from '../../../components/YesNoSelector';
import { RequestMatchContext } from './RequestMatch';
import { useTranslation } from 'react-i18next';

const German: React.FC = () => {
    const { space } = useTheme();
    const { matchRequest, setSubject, removeSubject, setCurrentIndex, setSkippedSubjectPriority, setSkippedSubjectList } = useContext(RequestMatchContext);
    const { t } = useTranslation();
    const [showSecond, setShowSecond] = useState<boolean>(false);
    const [isNativeLanguage, setIsNativeLanguage] = useState<boolean | null>(() => (containsDAZ(matchRequest.subjects) ? false : null));
    const [learningSince, setLearningSince] = useState<'<1' | '1-2' | '2-4' | '>4'>();

    const onGoNext = useCallback(() => {
        if (isNativeLanguage === false) {
            setShowSecond(true);
        } else {
            removeSubject(DAZ);
            setCurrentIndex(3);
            setSkippedSubjectPriority(false);
        }
    }, [isNativeLanguage, setCurrentIndex]);

    const onSecondNext = useCallback(() => {
        switch (learningSince) {
            case '<1':
            case '1-2':
                for (const subject of matchRequest.subjects) removeSubject(subject.name);
                setSubject({ name: DAZ, mandatory: true });
                setCurrentIndex(5); // 5 = details, skip subjects, priorities
                setSkippedSubjectPriority(true);
                setSkippedSubjectList(true);
                break;
            case '2-4':
                for (const subject of matchRequest.subjects) removeSubject(subject.name);
                setSubject({ name: DAZ, mandatory: true });
                setCurrentIndex(3); // 3 = subjects
                setSkippedSubjectPriority(true);
                setSkippedSubjectList(false);
                break;
            case '>4':
            default:
                removeSubject(DAZ);
                setCurrentIndex(3);
                setSkippedSubjectPriority(false);
                setSkippedSubjectList(false);
                break;
        }
    }, [matchRequest, learningSince, setCurrentIndex, setSubject]);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">{t('matching.wizard.pupil.german.heading')}</Heading>
            {!showSecond && (
                <>
                    <Heading>{t('matching.wizard.pupil.german.isNative')}</Heading>
                    <YesNoSelector
                        initialYes={isNativeLanguage === true}
                        initialNo={isNativeLanguage === false}
                        onPressNo={() => setIsNativeLanguage(false)}
                        onPressYes={() => setIsNativeLanguage(true)}
                        align="left"
                    />
                    <Box marginTop={space['1']} borderBottomWidth={1} borderBottomColor="primary.grey" />
                    <NextPrevButtons
                        disablingNext={{ is: isNativeLanguage === null, reason: t('reasonsDisabled.questionUnaswerd') }}
                        onPressPrev={() => setCurrentIndex(1)}
                        onPressNext={onGoNext}
                    />
                </>
            )}
            {showSecond && (
                <>
                    <Heading>{t('matching.wizard.pupil.german.howlong.heading')}</Heading>
                    <TwoColGrid>
                        <Column>
                            <IconTagList
                                initial={learningSince === '<1'}
                                variant="selection"
                                text={t('matching.wizard.pupil.german.howlong.option1')}
                                textIcon="<1"
                                onPress={() => setLearningSince('<1')}
                            />
                        </Column>
                        <Column>
                            <IconTagList
                                initial={learningSince === '1-2'}
                                variant="selection"
                                text={t('matching.wizard.pupil.german.howlong.option2')}
                                textIcon="1-2"
                                onPress={() => setLearningSince('1-2')}
                            />
                        </Column>
                        <Column>
                            <IconTagList
                                initial={learningSince === '2-4'}
                                variant="selection"
                                text={t('matching.wizard.pupil.german.howlong.option3')}
                                textIcon="2-4"
                                onPress={() => setLearningSince('2-4')}
                            />
                        </Column>
                        <Column>
                            <IconTagList
                                initial={learningSince === '>4'}
                                variant="selection"
                                text={t('matching.wizard.pupil.german.howlong.option4')}
                                textIcon=">4"
                                onPress={() => setLearningSince('>4')}
                            />
                        </Column>
                    </TwoColGrid>

                    {(learningSince === '<1' || learningSince === '1-2') && <AlertMessage content={t('matching.wizard.pupil.german.howlong.alertmsg')} />}

                    <NextPrevButtons
                        disablingNext={{ is: !learningSince, reason: t('reasonsDisabled.questionUnaswerd') }}
                        onPressPrev={() => setShowSecond(false)}
                        onPressNext={onSecondNext}
                    />
                </>
            )}
        </VStack>
    );
};
export default German;
