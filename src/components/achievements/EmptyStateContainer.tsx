import { Achievement_State } from '../../gql/graphql';
import EmptyStateCompleted from '../../assets/images/achievements/achievements-empty-state-completed.svg';
import { Text, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';

type EmptyStateContainerProps = {
    achievementState?: Achievement_State;
};

const EmptyStateContainer = ({ achievementState }: EmptyStateContainerProps) => {
    const { t } = useTranslation();
    switch (achievementState) {
        case Achievement_State.Completed:
            return (
                <VStack width="100%" display="flex" flexDirection="column" alignItems="center" space="4px">
                    <EmptyStateCompleted />
                    <Text fontWeight="bold" fontSize="lg" lineHeight="sm" textAlign="center">
                        {t('achievement.empty_state.Completed.title')}
                    </Text>
                    <Text fontSize="sm" lineHeight="xs" textAlign="center">
                        {t('achievement.empty_state.Completed.description')}
                    </Text>
                </VStack>
            );
        default:
            return <></>;
    }
};

export default EmptyStateContainer;
