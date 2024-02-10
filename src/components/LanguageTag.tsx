import { Row, useTheme } from 'native-base';
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
            iconPath={`languages/icon_${language.toLowerCase()}.svg`}
            text={t(`lernfair.languages.${language.toLowerCase()}` as unknown as TemplateStringsArray)}
        />
    );
}

export function LanguageTagList({ languages = allLanguages, onPress }: { languages?: string[]; onPress?: (language: string) => void }) {
    const { space } = useTheme();

    return (
        <Row space={space['0.5']} display="flex" flexWrap="wrap">
            {languages.map((it) => (
                <LanguageTag key={it} language={it} onPress={onPress} />
            ))}
        </Row>
    );
}
