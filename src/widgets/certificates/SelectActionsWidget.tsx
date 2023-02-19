import { AddIcon, Button, Checkbox, Column, DeleteIcon, Heading, Row, useTheme, Text, VStack } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import TextInput from '../../components/TextInput';
import { RequestCertificateContext } from '../../pages/RequestCertificate';

type Props = {
    onNext: () => any;
};

const SelectActionsWidget: React.FC<Props> = ({ onNext }) => {
    const { space } = useTheme();

    const { state, setState, setWizardIndex } = useContext(RequestCertificateContext);
    const [addOther, setAddOther] = useState<string>('');

    return (
        <VStack space={space['1']}>
            <Heading>Tätigkeit</Heading>
            <Text>Wähle aus, mit welchen Tätigkeiten du deine Lernpartner:innen unterstützt hast</Text>
            <Checkbox.Group value={state.actions} onChange={(actions) => setState((prev) => ({ ...prev, actions }))}>
                <VStack space={space['0.5']}>
                    <Checkbox value="preparation">Vorbereitung, Planung und Gestaltung von Unterrichtsstunden</Checkbox>
                    <Checkbox value="organisation">Bearbeitung und Vermittlung von Unterrichtsinhalten</Checkbox>
                    <Checkbox value="digital">Digitale Aufbereitung und Veranschaulichung von Unterrichtsinhalten</Checkbox>
                    <Checkbox value="detail">Vertiefung und Wiederholung von Unterrichtsinhalten</Checkbox>
                    <Checkbox value="group">Gemeinsame Bearbeitung von Übungs- und Hausaufgaben</Checkbox>
                    <Checkbox value="correction">Korrektur von Übungs- und Hausaufgaben</Checkbox>
                    <Checkbox value="testprep">Digitale Unterstützung bei der Prüfungsvorbereitung</Checkbox>
                    <Checkbox value="digital-help">Digitale Unterstützung beim Lernen</Checkbox>
                    <Text bold mb="1" mt="3">
                        Sonstiges
                    </Text>
                </VStack>
            </Checkbox.Group>

            {state.otherActions.map((o: string, index) => (
                <Column paddingBottom={space['0.5']} borderBottomColor={'primary.500'} borderBottomWidth={1}>
                    <Row alignItems="center">
                        <Text flex="1">{o ?? ''}</Text>
                        <Button
                            w={'56px'}
                            h={'56px'}
                            backgroundColor={'primary.900'}
                            onPress={() => {
                                setState((prev) => ({
                                    ...prev,
                                    otherActions: prev.otherActions.filter((a) => a !== o),
                                }));
                                setAddOther('');
                            }}
                        >
                            <DeleteIcon size="lg" color="white" />
                        </Button>
                    </Row>
                </Column>
            ))}

            <Row>
                <TextInput flex="1" value={addOther} onChangeText={setAddOther} _input={{ color: 'darkText' }} />
                <Button
                    w={'56px'}
                    h={'56px'}
                    backgroundColor={'primary.900'}
                    isDisabled={!addOther}
                    onPress={() => {
                        setState((prev) => ({
                            ...prev,
                            otherActions: [...prev.otherActions, addOther],
                        }));
                        setAddOther('');
                    }}
                >
                    <AddIcon size="lg" color="white" />
                </Button>
            </Row>
            <Button onPress={onNext}>Jetzt anfordern</Button>
            <Button variant="link" onPress={() => setWizardIndex((prev) => prev - 1)}>
                Zurück
            </Button>
        </VStack>
    );
};
export default SelectActionsWidget;
