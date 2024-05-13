import { Center } from 'native-base';
import HSection from './HSection';

export default {
    title: 'Molecules/HSection',
    component: HSection,
};

const Item = ({ value }: { value: number }) => (
    <Center w="150px" h="150px" borderColor="primary.900" backgroundColor="primary.100">
        {value}
    </Center>
);

export const Base = {
    render: () => (
        <HSection title="Items" showAll>
            <Item value={1} />
            <Item value={2} />
            <Item value={3} />
            <Item value={4} />
            <Item value={5} />
            <Item value={6} />
            <Item value={7} />
            <Item value={8} />
            <Item value={9} />
            <Item value={10} />
            <Item value={11} />
            <Item value={12} />
            <Item value={13} />
            <Item value={14} />
        </HSection>
    ),

    name: 'HSection',
};
