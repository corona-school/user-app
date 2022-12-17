import { Text, useTheme, Pressable, Column, Button, Row } from 'native-base';

import { LFInstructor } from '../types/lernfair/Course';

type Props = {
    isAdded?: boolean;
    instructor: LFInstructor;
    onPress?: () => any;
    onPressDelete?: () => any;
};

const InstructorRow: React.FC<Props> = ({ instructor, onPress, isAdded, onPressDelete }) => {
    const { space } = useTheme();
    return (
        <Pressable
            isDisabled={isAdded}
            onPress={onPress}
            paddingY={space['1']}
            _hover={
                (isAdded && {
                    bgColor: 'primary.100',
                }) ||
                undefined
            }
            borderBottomWidth="1"
            borderBottomColor={'gray.300'}
        >
            <Column marginLeft={space['1']}>
                <Row alignItems="center">
                    <Text color={isAdded ? 'gray.500' : 'darkText'} flex="1">
                        {instructor.firstname} {instructor.lastname}
                    </Text>
                    {onPressDelete && <Button onPress={onPressDelete}>löschen</Button>}
                </Row>

                {isAdded && (
                    <Text fontSize="sm" opacity={isAdded ? 1 : 0}>
                        Du hast diese Person bereits hinzugefügt.
                    </Text>
                )}
            </Column>
        </Pressable>
    );
};
export default InstructorRow;
