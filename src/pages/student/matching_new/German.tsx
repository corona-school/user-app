import { VStack, useTheme, Heading, Column, Button } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { containsDAZ, DAZ } from '../../../types/subject';
import IconTagList from '../../../widgets/IconTagList';
import TwoColGrid from '../../../widgets/TwoColGrid';
import { RequestMatchContext } from './RequestMatch';
import { useTranslation } from 'react-i18next';

const German: React.FC = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { setSubject, matchRequest, setCurrentIndex, removeSubject } = useContext(RequestMatchContext);

    // If the user already provides Daz, preselect to 'true' otherwise let the user decide again
    const [supportsDaz, setSupportsDaz] = useState<boolean | null>(() => (containsDAZ(matchRequest.subjects) ? true : null));

    const onNext = useCallback(() => {
        if (supportsDaz) {
            setSubject({ name: DAZ, grade: { min: 1, max: 13 } });
        } else {
            removeSubject(DAZ);
        }

        setCurrentIndex(3);
    }, [setSubject, removeSubject, setCurrentIndex, supportsDaz]);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">{t('matching.request.daz.heading')}</Heading>
            <Heading>{t('matching.request.daz.description')}</Heading>
            <TwoColGrid>
                <Column>
                    <IconTagList iconPath={`lf-yes.svg`} initial={supportsDaz ?? false} variant="selection" text="Ja" onPress={() => setSupportsDaz(true)} />
                </Column>
                <Column>
                    <IconTagList
                        iconPath={`lf-no.svg`}
                        initial={!(supportsDaz ?? true)}
                        variant="selection"
                        text="Nein"
                        onPress={() => setSupportsDaz(false)}
                    />
                </Column>
            </TwoColGrid>
            <Button onPress={onNext} isDisabled={supportsDaz === null}>
                {t('next')}
            </Button>
            <Button variant="outline" onPress={() => setCurrentIndex(1)}>
                {t('back')}
            </Button>
        </VStack>
    );
};
export default German;
