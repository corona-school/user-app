import { Column, Row, useTheme } from 'native-base';
import IconTagList from '../widgets/IconTagList';
import { useTranslation } from 'react-i18next';

export function GradeSelector({ grade, setGrade }: { grade: number; setGrade: (grade: number) => void }) {
    const { space } = useTheme();
    const { t } = useTranslation();

    return (
        <Row flexWrap="wrap" w="100%" mt={space['1']} marginBottom={space['1']}>
            {new Array(13).fill(0).map((_, i) => (
                <Column mb={space['0.5']} mr={space['0.5']}>
                    <IconTagList
                        initial={grade === i + 1}
                        textIcon={`${i + 1}`}
                        text={t('lernfair.schoolclass', {
                            class: i + 1,
                        })}
                        onPress={() => setGrade(i + 1)}
                    />
                </Column>
            ))}
        </Row>
    );
}
