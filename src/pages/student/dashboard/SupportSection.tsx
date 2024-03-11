import React from 'react';
import { Heading, useTheme, Stack, HStack, Button } from 'native-base';
import { useTranslation } from 'react-i18next';
import CategoriesIcon from '../../../assets/icons/lernfair/lf-categories.svg';
import PlayButtonIcon from '../../../assets/icons/lernfair/lf-play-button.svg';
import BlitzIcon from '../../../assets/icons/lernfair/lf-blitz.svg';
import GraduationCapIcon from '../../../assets/icons/lernfair/lf-graduation-cap.svg';
import ToolsIcon from '../../../assets/icons/lernfair/lf-tools.svg';
import DocumentIcon from '../../../assets/icons/lernfair/lf-document.svg';
import BookIcon from '../../../assets/icons/lernfair/lf-book.svg';
import AlignRightIcon from '../../../assets/icons/lernfair/lf-align-right.svg';

const SUPPORT_CATEGORIES = [
    { id: 'all', icon: <CategoriesIcon /> },
    { id: 'overview', icon: <PlayButtonIcon /> },
    { id: 'kurse', icon: <BlitzIcon /> },
    { id: 'support', icon: <GraduationCapIcon /> },
    { id: 'pedagogy', icon: <GraduationCapIcon /> },
    { id: 'tools', icon: <ToolsIcon /> },
    { id: 'material', icon: <DocumentIcon /> },
    { id: 'daz', icon: <BookIcon /> },
    { id: 'add_support', icon: <AlignRightIcon /> },
];

const SupportSection = () => {
    const { t } = useTranslation();
    const { space } = useTheme();

    const handleOnTilePress = (categoryId: string) => {
        const query = categoryId === 'all' ? '' : `?tab=${categoryId}`;
        window.open(`https://www.lern-fair.de/helfer/hilfestellungen${query}`, '_blank');
    };

    return (
        <React.Fragment>
            <Heading marginBottom={space['1']}>{t('dashboard.helpers.headlines.support')}</Heading>
            <Stack direction="row" space={space['1']} paddingY={space['0.5']} flexWrap="nowrap" overflowX="scroll">
                {SUPPORT_CATEGORIES.map((category) => (
                    <HStack marginBottom={space['1']} key={category.id}>
                        <Button
                            variant="ghost"
                            color="primary.900"
                            colorScheme="blueGray"
                            onPress={() => handleOnTilePress(category.id)}
                            leftIcon={category.icon}
                        >
                            {t(`dashboard.supportCategories.${category.id}` as unknown as TemplateStringsArray)}
                        </Button>
                    </HStack>
                ))}
            </Stack>
        </React.Fragment>
    );
};

export default SupportSection;
