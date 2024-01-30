import { useQuery } from '@apollo/client';
import { gql } from '../gql';
import AchievementModal from '../components/achievements/modals/AchievementModal';

const ACHIEVMENT_BY_ID_QUERY = gql(`
query achievementById($achievementId: Float!) {
    me {
      achievement(id: $achievementId) {
        subtitle
        name
        description
        achievementState
        achievementType
        actionType
        isNewAchievement
        steps {
          name
          isActive
        }
        maxSteps
        currentStep
        progressDescription
        achievedText
        image
        alternativeText
        actionName
        actionRedirectLink
      }
    }
  }`);

const AchievementMessageModal: React.FC<{ achievementId: number; isOpenModal: boolean; onClose: () => void }> = ({ achievementId, isOpenModal, onClose }) => {
    const { data } = useQuery(ACHIEVMENT_BY_ID_QUERY, { variables: { achievementId } });
    const achievement = data?.me.achievement;

    if (achievement) {
        return (
            <>
                <AchievementModal
                    title={achievement?.subtitle}
                    name={achievement.name}
                    description={achievement.description}
                    achievementState={achievement.achievementState}
                    achievementType={achievement.achievementType}
                    showModal={isOpenModal}
                    alternativeText={achievement.alternativeText}
                    currentStep={achievement.currentStep}
                    image={achievement.image}
                    isNewAchievement
                    maxSteps={achievement.maxSteps}
                    progressDescription={achievement.progressDescription ?? ''}
                    achievedText={achievement.achievedText ?? ''}
                    steps={achievement.steps ?? []}
                    onClose={onClose}
                />
            </>
        );
    }
    return <></>;
};

export default AchievementMessageModal;
