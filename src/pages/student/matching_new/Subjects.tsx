import { VStack, useTheme, Heading, Column, Button } from 'native-base';
import { useContext } from 'react';
import { gql } from '../../../gql';
import IconTagList from '../../../widgets/IconTagList';
import TwoColGrid from '../../../widgets/TwoColGrid';
import { RequestMatchContext } from './RequestMatch';
import { useQuery } from "@apollo/client";
import { useTranslation } from 'react-i18next';

const subjectQuery = gql(`query GetSubjects { subjects }`);

// Keep in sync with Backend!
export const SUBJECTS = [
    "Altgriechisch",
    "Biologie",
    "Chemie",
    "Chinesisch",
    "Deutsch",
    "Deutsch als Zweitsprache",
    "Englisch",
    "Erdkunde",
    "Französisch",
    "Geschichte",
    "Informatik",
    "Italienisch",
    "Kunst",
    "Latein",
    "Mathematik",
    "Musik",
    "Niederländisch",
    "Pädagogik",
    "Philosophie",
    "Physik",
    "Politik",
    "Religion",
    "Russisch",
    "Sachkunde",
    "Spanisch",
    "Wirtschaft"
] as const;

const SUBJECT_TO_ICON: { [subject in (typeof SUBJECTS)[number]]: string } = {
    "Deutsch als Zweitsprache": "deutsch_als_zweitsprace",
    Deutsch: "deutsch",
    Altgriechisch: "altgriechisch",
    Biologie: "biologie",
    Chemie: "chemie",
    Chinesisch: "chinesisch",
    Englisch: "englisch",
    Erdkunde: "erdkunde",
    Französisch: "franzoesisch",
    Geschichte: "geschichte",
    Informatik: "informatik",
    Italienisch: "italienisch",
    Kunst: "kunst",
    Latein: "latein",
    Mathematik: "mathematik",
    Musik: "musik",
    Niederländisch: "niederlaendisch",
    Philosophie: "philosophie",
    Physik: "physik",
    Politik: "politik",
    Pädagogik: "paedagogik",
    Religion: "religion",
    Russisch: "russisch",
    Sachkunde: "sachkunde",
    Spanisch: "spanisch",
    Wirtschaft: "wirtschaft"
}

const Subjects: React.FC = () => {
    const { space } = useTheme();
    const { matchRequest, removeSubject, setSubject, setCurrentIndex } = useContext(RequestMatchContext);
    const { t } = useTranslation();

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">Fachauswahl</Heading>
            <Heading>In welchen Fächern möchtest du unterstützen?</Heading>

            <TwoColGrid>
                {SUBJECTS.filter(it => it !== "Deutsch als Zweitsprache").map((subject) => (
                    <Column>
                        <IconTagList
                            key={subject}
                            initial={matchRequest.subjects.some(it => it.name === subject)}
                            variant="selection"
                            text={t(`lernfair.subjects.${subject}`)}
                            iconPath={`subjects/icon_${SUBJECT_TO_ICON[subject]}.svg`}
                            onPress={() => {
                                if (!matchRequest.subjects.some(it => it.name === subject)) {
                                    setSubject({ name: subject, grade: { min: 1, max: 13 }})
                                } else {
                                    removeSubject(subject);
                                }
                            }}
                        />
                    </Column>
                ))}
            </TwoColGrid>
            <Button
                isDisabled={matchRequest.subjects.length === 0}
                onPress={() => setCurrentIndex(2)} // 2 = german
            >
                Weiter
            </Button>
            <Button variant="outline" onPress={() => setCurrentIndex(0)}>
                Zurück
            </Button>
        </VStack>
    );
};
export default Subjects;
