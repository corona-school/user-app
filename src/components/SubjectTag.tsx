import { Row } from 'native-base';
import { useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Subject } from '../gql/graphql';
import { SUBJECT_TO_ICON } from '../types/subject';
import IconTagList from '../widgets/IconTagList';

export function SubjectTag({ subject }: { subject: Subject }) {
    const { t } = useTranslation();

    let text = t(`lernfair.subjects.${subject.name}` as unknown as TemplateStringsArray) as string;
    if (subject.mandatory) {
        text += ' (erforderlich)';
    }
    if (subject.grade) {
        text += ` (${subject.grade.min}. - ${subject.grade.max}. Klasse)`;
    }

    return <IconTagList key={subject.name} isDisabled text={text} iconPath={`subjects/icon_${(SUBJECT_TO_ICON as any)[subject.name] as string}.svg`} />;
}

export function SubjectTagList({ subjects }: { subjects: Subject[] }) {
    const { space } = useTheme();

    return (
        <Row space={space['0.5']}>
            {subjects.map((it) => (
                <SubjectTag subject={it} />
            ))}
        </Row>
    );
}
