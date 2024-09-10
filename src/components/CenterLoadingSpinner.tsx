import { IconLoader2 } from '@tabler/icons-react';

type Props = {};

const CenterLoadingSpinner: React.FC<Props> = () => {
    return (
        <div className="flex flex-1 justify-center items-center">
            <IconLoader2 className="size-6 text-primary animate-spin" />
        </div>
    );
};
export default CenterLoadingSpinner;
