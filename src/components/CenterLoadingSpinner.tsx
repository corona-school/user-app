import { Flex, Spinner } from 'native-base';

type Props = {
    color?: string;
};

const CenterLoadingSpinner: React.FC<Props> = ({ color }) => {
    return (
        <Flex flex="1" h="100%" justifyContent="center" alignItems="center">
            <Spinner color={color} />
        </Flex>
    );
};
export default CenterLoadingSpinner;
