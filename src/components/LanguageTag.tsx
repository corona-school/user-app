import { Row, Box, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import IconTagList from '../widgets/IconTagList';
import { languages as _allLanguages } from '../types/lernfair/Language';

const allLanguages = _allLanguages.map((it) => it.key);
export { allLanguages };

export function LanguageTag({ language, onPress }: { language: string; onPress?: (language: string) => void }) {
    const { t } = useTranslation();

    return (
        <IconTagList
            onPress={() => {
                onPress && onPress(language);
            }}
            icon={language.toLowerCase()}
            text={t(`lernfair.languages.${language.toLowerCase()}` as unknown as TemplateStringsArray)}
        />
    );
}

export function LanguageTagList({ languages = allLanguages, onPress }: { languages?: string[]; onPress?: (language: string) => void }) {
    const { space } = useTheme();

    return (
        <Row
            space={space['0.5']} // Horizontal spacing
            display="flex"
            flexWrap="wrap"
        >
            {languages.map((it) => (
                <Box key={it} marginY={space['0.5']}>
                    <LanguageTag language={it} onPress={onPress} />
                </Box>
            ))}
        </Row>
    );
}
