import { Box, Column, Row, useTheme } from 'native-base';
import IconTagList from './IconTagList';

export const YesNoSelector = ({
    initialYes,
    initialNo,
    onPressYes,
    onPressNo,
}: {
    initialYes?: boolean;
    initialNo?: boolean;
    onPressYes?: () => void;
    onPressNo?: () => void;
}) => {
    const { space } = useTheme();

    return (
        <Box alignItems="center" marginTop={space['0.5']}>
            <Row w="100%" space={space['1']} justifyContent="center">
                <Column flex={1} maxW="300px">
                    <IconTagList iconPath={`lf-yes.svg`} initial={initialYes} variant="selection" text="Ja" onPress={onPressYes} />
                </Column>
                <Column flex={1} maxW="300px">
                    <IconTagList iconPath={`lf-no.svg`} initial={initialNo} variant="selection" text="Nein" onPress={onPressNo} />
                </Column>
            </Row>
        </Box>
    );
};
