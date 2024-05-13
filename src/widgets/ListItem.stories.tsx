import { VStack } from 'native-base';
import ListItem from './ListItem';

export default {
    title: 'Molecules/ListItem',
    component: ListItem,
};

export const Base = {
    render: () => (
        <VStack space={2}>
            <ListItem label="Profile" />
            <ListItem label="Settings" />
            <ListItem label="Notifications" />
        </VStack>
    ),
    name: 'ListItem',
};
