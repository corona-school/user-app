import { Heading, VStack, Text, Box, useTheme } from 'native-base';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';

type Props = {
    heading: String;
    text: String;
    button1: { text: string; link: () => void };
    button2: { text: string; link: () => void };
};

const AlternativeOffer: React.FC<Props> = ({ heading, text, button1, button2 }) => {
    const bulletPoints: String[] = [
        'Du brauchst Hilfe beim Lernen.',
        'Du hast Nachteile beim Lernen.',
        'Deine Familie kann dir nicht beim Lernen helfen.',
        'Deine Familie kann keine Nachhilfe für dich bezahlen.',
    ];

    const { space } = useTheme();

    const bullets = bulletPoints.map((bullet, index) => {
        return <Text key={index}>● {bullet}</Text>;
    });

    return (
        <VStack space={space['0.5']}>
            <Heading fontSize="2xl">Alternative Angebote</Heading>

            <Text>
                Leider können wir dich bei Lern-Fair in diesem Fall nicht unterstützen. Unsere Hilfe wird von freiwilligen Helfer:innen angeboten. Deshalb haben
                wir nur begrenzte Plätze und möchten vor allem denjenigen Schüler:innen helfen, die folgende Kriterien erfüllen:
            </Text>

            <Box my={space['0.5']}>{bullets}</Box>

            <Heading fontSize="md" mt={space['1']}>
                {heading}
            </Heading>

            <Text>{text}</Text>

            <NextPrevButtons altPrevText={button1.text} altNextText={button2.text} onPressPrev={() => button1.link()} onPressNext={() => button2.link()} />
        </VStack>
    );
};

export default AlternativeOffer;
