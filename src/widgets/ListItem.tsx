import { Row, Text, ChevronRightIcon, useTheme, Pressable } from 'native-base';

type Props = {
    label: string;
    onPress?: () => any;
    isDisabled?: boolean;
};

const ListItem: React.FC<Props> = ({ label, onPress, isDisabled }) => {
    const { space } = useTheme();
    const textColor = isDisabled ? 'gray.300' : 'darkText';
    return (
        <Pressable onPress={onPress} isDisabled={isDisabled}>
            <Row borderBottomWidth={1} borderBottomColor="primary.100" paddingBottom={space['0.5']}>
                <Text flex="1" fontWeight={600} color={textColor}>
                    {label}
                </Text>
                <ChevronRightIcon color={textColor} />
            </Row>
        </Pressable>
    );
};
export default ListItem;
