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

export const SUBJECT_TO_ICON: { [subject in (typeof SUBJECTS)[number]]: string } = {
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

export const DAZ = "Deutsch als Zweitsprache";

export const containsDAZ = (subjects: Subject[]) => subjects.some(it => it.name === DAZ);

export const SubjectSelector = ({ subjects, addSubject, removeSubject, limit, selectable, variant = "selection" }: { subjects: Subject["name"][], selectable?: Subject["name"][], addSubject: (name: string) => void, removeSubject: (name: string) => void, limit?: number, variant?: "normal" | "selection" }) => {
    const { t } = useTranslation();

    return (
        <TwoColGrid>
            {((selectable ?? SUBJECTS.filter(it => it !== DAZ)) as string[]).map((subject) => (
                <Column>
                    <IconTagList
                        key={subject}
                        initial={subjects.includes(subject)}
                        variant={variant}
                        text={t(`lernfair.subjects.${subject}`)}
                        iconPath={`subjects/icon_${(SUBJECT_TO_ICON as any)[subject as any] as string}.svg`}
                        onPress={() => {
                            if (!subjects.includes(subject)) {
                                if (limit && subjects.length >= limit) {
                                    removeSubject(subjects[0]);
                                }
                                addSubject(subject)
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