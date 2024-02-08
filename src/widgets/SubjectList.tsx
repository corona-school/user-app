import Tag from '../components/Tag';
import { Subject } from '../gql/graphql';
import { useTranslation } from 'react-i18next';
import { Row, useTheme } from 'native-base';

const SubjectList = ({ subjects }: { subjects: Subject[] }) => {
    const { t } = useTranslation();
    const { space } = useTheme();

    return (
        <Row space={space['0.5']}>
            {subjects.map((sub) => (
                <Tag
                    text={t(`lernfair.subjects.${sub.name}` as unknown as TemplateStringsArray) + (sub.mandatory ? ' (priorisiert)' : '')}
                    variant="secondary-light"
                    marginBottom={0}
                />
            ))}
        </Row>
    );
};

export default SubjectList;
