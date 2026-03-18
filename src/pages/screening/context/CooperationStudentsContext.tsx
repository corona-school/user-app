import { createContext } from 'react';

interface CooperationStudentsContextValue {
    cooperations: { id: number; name: string; type: string }[];
    refresh?: () => void;
}

export const CooperationStudentsContext = createContext<CooperationStudentsContextValue>({
    cooperations: [],
    refresh: () => {},
});
