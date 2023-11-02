import { Heading, VStack, Text, Box, useTheme } from 'native-base';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import { useTranslation } from 'react-i18next';
import BulletList from '../../../widgets/BulletList';

type Props = {
    heading: String;
    text: String;
    button1: { text: string; link: () => void };
    button2: { text: string; link: () => void };
};

const AlternativeOffer: React.FC<Props> = ({ heading, text, button1, button2 }) => {
    const { t } = useTranslation();

    const { space } = useTheme();

    return (
        <VStack space={space['0.5']}>
            <Heading fontSize="2xl">{t('matching.wizard.pupil.alternatives.heading')}</Heading>

            <Text>{t('matching.wizard.pupil.alternatives.text')}</Text>

            <Box my={space['0.5']}>
                <BulletList bulletPoints={t('matching.wizard.pupil.alternatives.bulletPoints', { returnObjects: true })} />
            </Box>

            <Heading fontSize="md" mt={space['1']}>
                {heading}
            </Heading>

            <Text>{text}</Text>

            <NextPrevButtons altPrevText={button1.text} altNextText={button2.text} onPressPrev={() => button1.link()} onPressNext={() => button2.link()} />
        </VStack>
    );
};

export default AlternativeOffer;
