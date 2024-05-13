import { Flex, Text } from 'native-base';
import ViewPager from './ViewPager';

export default {
    title: 'Organisms/ViewPager',
    component: ViewPager,
};

export const Base = {
    render: () => (
        <ViewPager>
            <Flex w="100%" h="650px" bg="primary.100" justifyContent="center" alignItems="center">
                <Text>Page 1</Text>
            </Flex>
            <Flex w="100%" h="650px" bg="primary.400" justifyContent="center" alignItems="center">
                <Text color="white">Page 2</Text>
            </Flex>
            <Flex w="100%" h="650px" bg="primary.900" justifyContent="center" alignItems="center">
                <Text color="white">Page 3</Text>
            </Flex>
        </ViewPager>
    ),

    name: 'ViewPager',
};
