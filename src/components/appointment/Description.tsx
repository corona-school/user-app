import { Divider, Text, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';

type DescriptionProps = {
    description?: string;
};

const Description: React.FC<DescriptionProps> = ({ description }) => {
    const { t } = useTranslation();

    return (
        <>
            <Divider thickness="0.25" my={5} />
            <VStack p={3}>
                <Text color="primary.900" mb="2">
                    {t('appointment.detail.descriptionHeader')}
                </Text>
                <Text color="primary.600" fontWeight="normal">
                    {description}
                </Text>
            </VStack>
            <Divider thickness="0.25" my={5} />
        </>
    );
};

export default Description;
