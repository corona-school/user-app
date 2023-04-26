import i18next from '../../../I18n';
import { FlatList } from 'react-native';
import { Circle, HStack, Text, useTheme } from 'native-base';

const groupTexts: string[] = [
    i18next.t('introduction.groupDescription.first'),
    i18next.t('introduction.groupDescription.second'),
    i18next.t('introduction.groupDescription.third'),
];

const GroupOnboardingInfos: React.FC = () => {
    const { space } = useTheme();

    return (
        <FlatList
            data={groupTexts}
            renderItem={({ item }) => (
                <HStack space={space['1']} mb={space['1']}>
                    <Circle backgroundColor="black" size="4px" mt={2} />
                    <Text numberOfLines={10}>{item}</Text>
                </HStack>
            )}
        />
    );
};

export default GroupOnboardingInfos;
