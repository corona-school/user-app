import { Column } from "native-base";
import { useTranslation } from "react-i18next";
import { Subject } from "../gql/graphql";
import { SUBJECTS, DAZ, SUBJECT_TO_ICON } from "../types/subject";
import IconTagList from "./IconTagList";
import TwoColGrid from "./TwoColGrid";


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