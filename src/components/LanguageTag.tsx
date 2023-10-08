import { Row, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import IconTagList from '../widgets/IconTagList';

export function LanguageTag({ language }: { language: string }) {
    const { t } = useTranslation();

    return (
        <IconTagList
            isDisabled
            iconPath={`languages/icon_${language.toLowerCase()}.svg`}
            text={t(`lernfair.languages.${language.toLowerCase()}` as unknown as TemplateStringsArray)}
        />
    );
}

export function LanguageTagList({ languages }: { languages: string[] }) {
    const { space } = useTheme();

    return (
        <Row space={space['0.5']}>
            {languages.map((it, id) => (
                <LanguageTag key={id} language={it} />
            ))}
        </Row>
    );
}
