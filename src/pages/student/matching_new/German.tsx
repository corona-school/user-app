import { t } from 'i18next';
import { VStack, useTheme, Heading, Column, Button, Box, Row } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { containsDAZ, DAZ } from '../../../types/subject';
import IconTagList from '../../../widgets/IconTagList';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import TwoColGrid from '../../../widgets/TwoColGrid';
import { YesNoSelector } from '../../../widgets/YesNoSelector';
import { RequestMatchContext } from './RequestMatch';

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
            <Heading fontSize="2xl">Deutsch als Zweitsprache</Heading>
            <Heading>
                Kannst du dir vorstellen Schüler:innen zu unterstützen, die Deutsch als Zweitsprache sprechen und nur über wenige Deutschkenntnisse verfügen?
            </Heading>
            <YesNoSelector
                initialYes={supportsDaz ?? false}
                initialNo={!(supportsDaz ?? true)}
                onPressYes={() => setSupportsDaz(true)}
                onPressNo={() => setSupportsDaz(false)}
            />
            <Box marginTop={space['1']} borderBottomWidth={1} borderBottomColor="primary.grey" />
            <NextPrevButtons isDisabledNext={!supportsDaz} onPressPrev={() => setCurrentIndex(1)} onPressNext={onNext} />
        </VStack>
    );
};
export default German;
