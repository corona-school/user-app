import { useQuery } from '@apollo/client';
import { gql } from '../gql';
import AchievementModal from '../components/achievements/modals/AchievementModal';

const ACHIEVMENT_BY_ID_QUERY = gql(`
query achievementById($achievementId: Float!) {
    me {
      achievement(id: $achievementId) {
        title
        tagline
        subtitle
        description
        footer
        achievementState
        achievementType
        isNewAchievement
        steps {
          name
          isActive
        }
        maxSteps
        currentStep
        image
        alternativeText
        actionType
        actionName
        actionRedirectLink
      }
    }
  }`);

const AchievementMessageModal: React.FC<{ achievementId: number; isOpenModal: boolean; onClose: () => void }> = ({ achievementId, isOpenModal, onClose }) => {
    const { data } = useQuery(ACHIEVMENT_BY_ID_QUERY, { variables: { achievementId }, skip: !achievementId });
    const achievement = data?.me.achievement;

    if (achievement) {
        return (
            <>
                <AchievementModal
                    title={achievement.title ?? ''}
                    tagline={achievement.tagline ?? undefined}
                    subtitle={achievement.subtitle ?? undefined}
                    footer={achievement.footer ?? undefined}
                    description={achievement.description}
                    achievementState={achievement.achievementState}
                    achievementType={achievement.achievementType}
                    showModal={isOpenModal}
                    alternativeText={achievement.alternativeText}
                    currentStep={achievement.currentStep}
                    image={achievement.image}
                    isNewAchievement
                    maxSteps={achievement.maxSteps}
                    steps={achievement.steps ?? []}
                    onClose={onClose}
                />
            </>
        );
    }
    return <></>;
};

export default AchievementMessageModal;
