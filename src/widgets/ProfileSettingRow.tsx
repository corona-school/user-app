import { View, Row, Column, Heading } from 'native-base';
import { ReactNode } from 'react';

type Props = {
    title: string;
    children: ReactNode;
    isSpace?: boolean;
};

const ProfileSettingRow: React.FC<Props> = ({ title, children, isSpace = true }) => {
    return (
        <View paddingY={isSpace ? 3 : 0}>
            <Row>
                <Column mb={2}>
                    <Heading fontSize="lg">{title}</Heading>
                </Column>
            </Row>
            <Row paddingY={3} flexDirection="column">
                {children}
            </Row>
        </View>
    );
};
export default ProfileSettingRow;
