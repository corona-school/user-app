import AchievementMessageModal from '@/modals/AchievementMessageModal';
import LeavePageModal from '@/modals/LeavePageModal';
import { createContext, FC, ReactNode, useState } from 'react';

interface GlobalModalsValue {
    openLeavePageModal: (values: ModalState) => void;
    openAchievementModal: (values: ModalState) => void;
}

export const GlobalModalsContext = createContext<GlobalModalsValue>({
    openLeavePageModal: () => {},
    openAchievementModal: () => {},
});

interface ModalState {
    isOpen: boolean;
    options?: any;
}

export const GlobalModalsProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [leavePageModal, setLeavePageModal] = useState<ModalState>({ isOpen: false, options: {} });
    const [achievementModal, setAchievementModal] = useState<ModalState>({ isOpen: false, options: {} });
    return (
        <GlobalModalsContext.Provider
            value={{
                openLeavePageModal: setLeavePageModal,
                openAchievementModal: setAchievementModal,
            }}
        >
            <LeavePageModal {...leavePageModal.options} isOpen={leavePageModal.isOpen} onOpenChange={() => setLeavePageModal({ isOpen: false })} />
            <AchievementMessageModal
                {...achievementModal.options}
                isOpenModal={achievementModal.isOpen}
                onClose={() => setAchievementModal({ isOpen: false })}
            />
            {children}
        </GlobalModalsContext.Provider>
    );
};
