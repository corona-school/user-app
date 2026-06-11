import { useState } from 'react';
import { DAZ } from '../../../types/subject';
import AlertMessage from '../../../widgets/AlertMessage';
import IconTagList from '../../../widgets/IconTagList';
import TwoColGrid from '../../../widgets/TwoColGrid';
import { YesNoSelector } from '../../../components/YesNoSelector';
import { useTranslation } from 'react-i18next';
import { useMatchRequestForm } from './useMatchRequestForm';
import { MatchRequestStep, MatchRequestStepTitle } from '@/components/match-request/MatchRequestStep';
import { Typography } from '@/components/Typography';

const German: React.FC = () => {
    const { form, goBack, goNext, onFormChange } = useMatchRequestForm();
    const { t } = useTranslation();
    const [showLearningGermanSince, setShowLearningGermanSince] = useState<boolean>(false);

    const onGoNext = async () => {
        if (showLearningGermanSince) {
            switch (form.learningGermanSince) {
                case '<1':
                case '1-2':
                    break;
                case '2-4':
                    onFormChange({ subjects: [{ name: DAZ, mandatory: true }] });
                    break;
                case '>4':
                default:
                    onFormChange({ subjects: form.subjects.filter((s) => s.name !== DAZ) });
                    break;
            }
            goNext();
            return;
        }
        if (!form.isNativeGermanSpeaker) {
            setShowLearningGermanSince(true);
        } else {
            onFormChange({ learningGermanSince: undefined });
            goNext();
        }
    };

    const onGoBack = () => {
        if (showLearningGermanSince) {
            setShowLearningGermanSince(false);
        } else {
            goBack();
        }
    };

    return (
        <MatchRequestStep
            onBack={onGoBack}
            onNext={onGoNext}
            isNextDisabled={form.isNativeGermanSpeaker === undefined || (showLearningGermanSince && form.learningGermanSince === undefined)}
            reasonNextDisabled={t('reasonsDisabled.questionUnaswerd')}
        >
            <MatchRequestStepTitle>{t('matching.wizard.pupil.german.heading')}</MatchRequestStepTitle>
            {!showLearningGermanSince && (
                <>
                    <Typography variant="h5">{t('matching.wizard.pupil.german.isNative')}</Typography>
                    <YesNoSelector
                        initialYes={form.isNativeGermanSpeaker === true}
                        initialNo={form.isNativeGermanSpeaker === false}
                        onPressNo={() => onFormChange({ isNativeGermanSpeaker: false })}
                        onPressYes={() => onFormChange({ isNativeGermanSpeaker: true, subjects: form.subjects.filter((s) => s.name !== DAZ) })}
                        align="left"
                    />
                </>
            )}
            {showLearningGermanSince && (
                <>
                    <Typography variant="h5">{t('matching.wizard.pupil.german.howlong.heading')}</Typography>
                    <TwoColGrid>
                        <div className="flex flex-col">
                            <IconTagList
                                initial={form.learningGermanSince === '<1'}
                                variant="selection"
                                text={t('matching.wizard.pupil.german.howlong.option1')}
                                textIcon="<1"
                                onPress={() => onFormChange({ learningGermanSince: '<1', subjects: [{ name: DAZ, mandatory: true }] })}
                            />
                        </div>
                        <div className="flex flex-col">
                            <IconTagList
                                initial={form.learningGermanSince === '1-2'}
                                variant="selection"
                                text={t('matching.wizard.pupil.german.howlong.option2')}
                                textIcon="1-2"
                                onPress={() => onFormChange({ learningGermanSince: '1-2', subjects: [{ name: DAZ, mandatory: true }] })}
                            />
                        </div>
                        <div className="flex flex-col">
                            <IconTagList
                                initial={form.learningGermanSince === '2-4'}
                                variant="selection"
                                text={t('matching.wizard.pupil.german.howlong.option3')}
                                textIcon="2-4"
                                onPress={() => onFormChange({ learningGermanSince: '2-4' })}
                            />
                        </div>
                        <div className="flex flex-col">
                            <IconTagList
                                initial={form.learningGermanSince === '>4'}
                                variant="selection"
                                text={t('matching.wizard.pupil.german.howlong.option4')}
                                textIcon=">4"
                                onPress={() => onFormChange({ learningGermanSince: '>4' })}
                            />
                        </div>
                    </TwoColGrid>

                    {(form.learningGermanSince === '<1' || form.learningGermanSince === '1-2') && (
                        <AlertMessage content={t('matching.wizard.pupil.german.howlong.alertmsg')} />
                    )}
                </>
            )}
        </MatchRequestStep>
    );
};
export default German;
