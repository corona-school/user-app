import { Text, Column, Box, Button, useTheme, useBreakpointValue, Heading } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Subject } from '../gql/graphql';
import SubjectList from './SubjectList';
import DisableableButton from '../components/DisablebleButton';

const OpenMatchRequest = ({
    cancelLoading,
    subjects,
    showCancelMatchRequestModal,
    index,
    onEditRequest,
}: {
    cancelLoading: boolean;
    subjects: Subject[];
    showCancelMatchRequestModal: () => void;
    index: number;
    onEditRequest: () => void;
}) => {
    const { space } = useTheme();
    const { t } = useTranslation();

    const CardGrid = useBreakpointValue({
        base: '100%',
        lg: '48%',
    });

    return (
        <Column width={CardGrid} marginRight="15px" marginBottom="15px">
            <Box bgColor="primary.100" padding={space['1.5']} borderRadius={8}>
                <Heading color="darkText">
                    {t('matching.request.check.request')} {`${index + 1}`.padStart(2, '0')}
                </Heading>

                <Column mt="3" space={space['0.5']}>
                    <Text color="darkText" bold>
                        {t('matching.shared.subjects')}
                    </Text>
                    {subjects && <SubjectList subjects={subjects} />}
                </Column>
                <DisableableButton
                    isDisabled={cancelLoading}
                    reasonDisabled={t('reasonsDisabled.loading')}
                    variant="outlinelight"
                    mt="3"
                    color="darkText"
                    onPress={showCancelMatchRequestModal}
                    _text={{
                        color: 'darkText',
                    }}
                >
                    {t('matching.request.check.removeRequest')}
                </DisableableButton>
                <Button
                    mt={space['0.5']}
                    variant="link"
                    _text={{
                        color: 'darkText',
                    }}
                    onPress={onEditRequest}
                >
                    {t('matching.request.check.editRequest')}
                </Button>
            </Box>
        </Column>
    );
};
export default OpenMatchRequest;
