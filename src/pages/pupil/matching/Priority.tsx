import { Button } from 'native-base';
import { useTheme } from 'native-base';
import { Text, VStack, Heading } from 'native-base';
import { useContext } from 'react';
import { DAZ } from '../../../types/subject';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import { SubjectSelector } from '../../../widgets/SubjectSelector';
import { RequestMatchContext } from './RequestMatch';

const Priority: React.FC = () => {
    const { space } = useTheme();
    const { matchRequest, setSubject, setCurrentIndex } = useContext(RequestMatchContext);
    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">Priorisierung</Heading>
            <Heading>In welchen Fach brauchst du am meisten Hilfe?</Heading>

            <Text>
                Wir versuchen jemanden für dich zu finden der dir in allen Fächern hilft. Das ist aber leider nicht immer möglich. Daher kannst du hier angeben,
                welches Fach dir am wichtigsten ist.
            </Text>

            <SubjectSelector
                subjects={matchRequest.subjects.filter((it) => it.mandatory && it.name !== DAZ).map((it) => it.name)}
                selectable={matchRequest.subjects.filter((it) => it.name !== DAZ).map((it) => it.name)}
                addSubject={(it) => setSubject({ name: it, mandatory: true })}
                removeSubject={(it) => setSubject({ name: it, mandatory: false })}
                limit={1}
            />
            <NextPrevButtons
                isDisabledNext={matchRequest.subjects.every((it) => !it.mandatory)}
                onPressPrev={() => setCurrentIndex(3)}
                onPressNext={() => setCurrentIndex(5)}
            />
        </VStack>
    );
};
export default Priority;
