import { AddIcon, Button, Checkbox, Column, DeleteIcon, Heading, Row, useTheme, Text, VStack } from 'native-base';
import { useContext, useState } from 'react';
import TextInput from '../../components/TextInput';
import { RequestCertificateContext } from '../../pages/RequestCertificate';
import { useTranslation } from 'react-i18next';
import DisablebleButton from '../../components/DisablebleButton';

type Props = {
    onNext: () => any;
};

const SelectActionsWidget: React.FC<Props> = ({ onNext }) => {
    const { space } = useTheme();
    const { t } = useTranslation();

    const { state, setState, setWizardIndex } = useContext(RequestCertificateContext);
    const [addOther, setAddOther] = useState<string>('');

    return (
        <VStack space={space['1']}>
            <Heading>{t('certificate.request_for_match.activities.title')}</Heading>
            <Text>{t('certificate.request_for_match.activities.subtitle')}</Text>
            <Checkbox.Group value={state.actions} onChange={(actions) => setState((prev) => ({ ...prev, actions }))}>
                <VStack space={space['0.5']}>
                    <Checkbox value={t('certificate.request_for_match.activities.preparation')}>
                        {t('certificate.request_for_match.activities.preparation')}
                    </Checkbox>
                    <Checkbox value={t('certificate.request_for_match.activities.visualization')}>
                        {t('certificate.request_for_match.activities.visualization')}
                    </Checkbox>
                    <Checkbox value={t('certificate.request_for_match.activities.visualization_digital')}>
                        {t('certificate.request_for_match.activities.visualization_digital')}
                    </Checkbox>
                    <Checkbox value={t('certificate.request_for_match.activities.repetition')}>
                        {t('certificate.request_for_match.activities.repetition')}
                    </Checkbox>
                    <Checkbox value={t('certificate.request_for_match.activities.homework')}>{t('certificate.request_for_match.activities.homework')}</Checkbox>
                    <Checkbox value={t('certificate.request_for_match.activities.correct_homework')}>
                        {t('certificate.request_for_match.activities.correct_homework')}
                    </Checkbox>
                    <Checkbox value={t('certificate.request_for_match.activities.prepare_exam')}>
                        {t('certificate.request_for_match.activities.prepare_exam')}
                    </Checkbox>
                    <Checkbox value={t('certificate.request_for_match.activities.help_learning')}>
                        {t('certificate.request_for_match.activities.help_learning')}
                    </Checkbox>
                    <Text bold mb="1" mt="3">
                        {t('certificate.request_for_match.activities.other')}
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
                <DisablebleButton
                    isDisabled={!addOther}
                    reasonDisabled={t('reasonsDisabled.fieldEmpty')}
                    w="56px"
                    h="56px"
                    backgroundColor="primary.900"
                    onPress={() => {
                        setState((prev) => ({
                            ...prev,
                            otherActions: [...prev.otherActions, addOther],
                        }));
                        setAddOther('');
                    }}
                >
                    <AddIcon size="lg" color="white" />
                </DisablebleButton>
            </Row>
            <Button onPress={onNext}>{t('certificate.request_for_match.submit')}</Button>
            <Button variant="link" onPress={() => setWizardIndex((prev) => prev - 1)}>
                {t('back')}
            </Button>
        </VStack>
    );
};
export default SelectActionsWidget;
