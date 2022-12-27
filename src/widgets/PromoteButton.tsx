import { gql } from './../gql';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Tooltip, useBreakpointValue, useTheme, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';

type Props = {
    subcourseId: number;
};

const PromoteButton: React.FC<Props> = ({ subcourseId }) => {
    const { sizes } = useTheme();
    const toast = useToast();

    const { t } = useTranslation();

    const { data, loading } = useQuery(
        gql(`
            query GetRoles {
                myRoles
            }
        `)
    );

    // alreadyPromoted = false
    // courseCapacity < 0.75
    // published 3 days ago

    const [promote] = useMutation(
        gql(
            `mutation PromoteSubcourse($subcourseId: Float!) {
        promoteSubcourse(subcourseId: $subcourseId)
        }`
        ),
        { variables: { subcourseId: subcourseId } }
    );

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    async function doPromote() {
        await promote();
        toast.show({ description: 'Kurs beworben' });
        console.log('promoted');
        // refresh();
    }

    return (
        <div>
            <Tooltip label={t('single.buttonPromote.criteria')} p={3}>
                <Button width={ButtonContainer} onPress={doPromote}>
                    Kurs bewerben
                </Button>
            </Tooltip>
        </div>
    );
};

export default PromoteButton;
