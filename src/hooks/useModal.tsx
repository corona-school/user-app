import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useState, useMemo } from 'react';

export type IModalTheme = 'light' | 'dark' | 'image';

type LFModal = {
    visible: boolean;
    content?: ReactNode;
    variant: IModalTheme;
    closeable: boolean;
    headline?: string;

    show: (options: { variant: IModalTheme; closeable?: boolean; headline?: string }, content: ReactNode) => void;
    hide(): void;
};

export const LFModalContext = createContext<LFModal>({
    visible: false,
    content: null,
    variant: 'light',
    closeable: false,

    show: () => {},
    hide: () => {},
});

export const LFModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modalValues, setModal] = useState<{ visible: boolean; content?: ReactNode; variant: IModalTheme; closeable: boolean; headline?: string }>({
        visible: false,
        variant: 'light',
        closeable: false,
    });

    const show = useCallback(
        ({ variant, closeable, headline }: { variant: IModalTheme; closeable?: boolean; headline?: string }, content: ReactNode) =>
            setModal({ visible: true, variant, content, closeable: closeable ?? false, headline }),
        [setModal]
    );
    const hide = useCallback(() => setModal({ visible: false, content: null, variant: 'light', closeable: false }), [setModal]);

    const value = useMemo(() => ({ ...modalValues, show, hide }), [modalValues, show, hide]);

    return <LFModalContext.Provider value={value}>{children}</LFModalContext.Provider>;
};

export const useModal = () => {
    const { show, hide } = useContext(LFModalContext);
    return { show, hide };
};

export default useModal;
