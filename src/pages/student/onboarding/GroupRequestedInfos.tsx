import { Circle, Text, FlatList, HStack, Heading, useTheme, Link } from 'native-base';
import i18next from '../../../I18n';
import { useTranslation } from 'react-i18next';

const coachingInfos = [
    {
        text: i18next.t('introduction.requestedDescription.coaching.online'),
        link: 'https://www.lern-fair.de/helfer/gruppenkurse',
        linkText: 'Gruppen-Nachhilfe für Anfänger',
    },
    { text: i18next.t('introduction.requestedDescription.coaching.materials') },
];
const materials = [
    i18next.t('introduction.requestedDescription.coaching.one'),
    i18next.t('introduction.requestedDescription.coaching.two'),
    i18next.t('introduction.requestedDescription.coaching.three'),
];
const languageInfos = [
    {
        text: i18next.t('introduction.requestedDescription.language.one'),
        link: 'https://www.lern-fair.de/helfer/gruppenkurse',
        linkText: 'Deutsch für Anfänger',
    },
    { text: i18next.t('introduction.requestedDescription.language.two') },
];
const focousInfos = [{ text: i18next.t('introduction.requestedDescription.focus.one'), mail: 'fokus@lern-fair.de' }];

const GroupRequestedInfos: React.FC = () => {
    const { space } = useTheme();
    const { t } = useTranslation();

    return (
        <>
            <Heading fontSize="sm" mb="2">
                {t('introduction.requestedDescription.coaching.header')}
            </Heading>
            <FlatList
                data={coachingInfos}
                renderItem={({ item }) => (
                    <HStack space={space['1']}>
                        <Circle backgroundColor="black" size="4px" mt={2} />
                        <Text numberOfLines={10}>
                            {item.text} {item.link && item.linkText && <Link href={item.link}>{item.linkText}</Link>}
                        </Text>
                    </HStack>
                )}
            />
            <FlatList
                ml="5"
                mb="3"
                data={materials}
                renderItem={({ item }) => (
                    <HStack space={space['1']}>
                        <Circle borderColor="black" borderWidth="1" size="4px" mt={2} />
                        <Text numberOfLines={10}>{item}</Text>
                    </HStack>
                )}
            />
            <Heading fontSize="sm" mb="2">
                {t('introduction.requestedDescription.language.header')}
            </Heading>
            <FlatList
                mb="3"
                data={languageInfos}
                renderItem={({ item }) => (
                    <HStack space={space['1']}>
                        <Circle backgroundColor="black" size="4px" mt={2} />
                        <Text numberOfLines={10}>
                            {item.text} {item.link && item.linkText && <Link href={item.link}>{item.linkText}</Link>}
                        </Text>
                    </HStack>
                )}
            />
            <Heading fontSize="sm" mb="2">
                {t('introduction.requestedDescription.focus.header')}
            </Heading>
            <FlatList
                data={focousInfos}
                renderItem={({ item }) => (
                    <HStack space={space['1']} mb={space['1']}>
                        <Circle backgroundColor="black" size="4px" mt={2} />
                        <Text numberOfLines={10}>
                            {item.text}
                            {item.mail && <Link href={`mailto:${item.mail}?`}>{item.mail}</Link>}
                        </Text>
                    </HStack>
                )}
            />
        </>
    );
};

export default GroupRequestedInfos;
