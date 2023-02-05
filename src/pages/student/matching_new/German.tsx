import { VStack, useTheme, Heading, Column, Button } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import IconTagList from '../../../widgets/IconTagList';
import { containsDAZ, DAZ } from '../../../widgets/SubjectSelector';
import TwoColGrid from '../../../widgets/TwoColGrid';
import { RequestMatchContext } from './RequestMatch';

const German: React.FC = () => {
    const { space } = useTheme();
    const { setSubject, matchRequest, setCurrentIndex, removeSubject } = useContext(RequestMatchContext);

    // If the user already provides Daz, preselect to 'true' otherwise let the user decide again
    const [supportsDaz, setSupportsDaz] = useState<boolean | null>(() => containsDAZ(matchRequest.subjects) ? true : null);

    const onNext = useCallback(() => {
        if (supportsDaz) {
            setSubject({ name: DAZ, grade: { min: 1, max: 13 }});
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
            <TwoColGrid>
                <Column>
                    <IconTagList iconPath={`lf-yes.svg`} initial={supportsDaz ?? false} variant="selection" text="Ja" onPress={() => setSupportsDaz(true)} />
                </Column>
                <Column>
                    <IconTagList iconPath={`lf-no.svg`} initial={!(supportsDaz ?? true)} variant="selection" text="Nein" onPress={() => setSupportsDaz(false)} />
                </Column>
            </TwoColGrid>
            <Button onPress={onNext} isDisabled={supportsDaz === null}>
                Weiter
            </Button>
            <Button variant="outline" onPress={() => setCurrentIndex(1)}>
                Zurück
            </Button>
        </VStack>
    );
};
export default German;
