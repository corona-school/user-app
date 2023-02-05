import { Column } from "native-base";
import { useTranslation } from "react-i18next";
import { Subject } from "../gql/graphql";
import IconTagList from "./IconTagList";
import TwoColGrid from "./TwoColGrid";

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

export const SubjectSelector = ({ subjects, setSubject, removeSubject }: { subjects: Subject[], setSubject: (subject: Subject) => void, removeSubject: (name: string) => void }) => {
    const { t } = useTranslation();

    return (
        <TwoColGrid>
            {SUBJECTS.filter(it => it !== "Deutsch als Zweitsprache").map((subject) => (
                <Column>
                    <IconTagList
                        key={subject}
                        initial={subjects.some(it => it.name === subject)}
                        variant="selection"
                        text={t(`lernfair.subjects.${subject}`)}
                        iconPath={`subjects/icon_${SUBJECT_TO_ICON[subject]}.svg`}
                        onPress={() => {
                            if (!subjects.some(it => it.name === subject)) {
                                setSubject({ name: subject, grade: { min: 1, max: 13 }})
                            } else {
                                removeSubject(subject);
                            }
                        }}
                    />
                </Column>
            ))}
        </TwoColGrid>
    )
}