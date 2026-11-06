import { Important_Information_Category_Enum } from '@/gql/graphql';
import { getImportantInformationLabel } from '@/helper/important-information-helper';
import { Badge } from '@/components/Badge';
import { IconAlertTriangle, IconArrowRight, IconDirections, IconFlame, IconScubaMask, IconSparkles2, IconSpeakerphone, IconStar } from '@tabler/icons-react';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';

type NextStepsCardProps = {
    title?: string;
    subtitle?: string;
    onClick?: () => void;
    description?: string;
    category?: Important_Information_Category_Enum;
    ctaLabel?: string;
};

const badgeIconMap = {
    [Important_Information_Category_Enum.HighDemand]: <IconFlame size={16} className="fill-[#DB4A3F] text-[#DB4A3F] mr-1" />,
    [Important_Information_Category_Enum.Event]: <IconSpeakerphone size={16} className="text-white mr-1" />,
    [Important_Information_Category_Enum.Important]: <IconAlertTriangle size={16} className="text-white mr-1" />,
    [Important_Information_Category_Enum.Feedback]: <IconDirections size={16} className="text-white mr-1" />,
    [Important_Information_Category_Enum.FeatureUpdate]: <IconSparkles2 size={16} className="text-white mr-1" />,
    [Important_Information_Category_Enum.HolidayInfo]: <IconScubaMask size={16} className="text-white mr-1" />,
    [Important_Information_Category_Enum.News]: <IconStar size={16} className="text-white mr-1" />,
};

const NextStepsCard: React.FC<NextStepsCardProps> = ({ title, subtitle, onClick, description, category, ctaLabel }) => {
    return (
        <div className="min-w-[335px] md:max-w-[370px] w-full h-[280px] bg-primary flex flex-col p-5 rounded-lg">
            <Badge className="mb-8 bg-primary-midnight h-6">
                {category && badgeIconMap[category]}
                <Typography variant="sm" className="text-white font-semibold uppercase text-xs">
                    {category ? getImportantInformationLabel(category) : ''}
                </Typography>
            </Badge>
            <Typography variant="h5" className="text-white mb-2 line-clamp-2">
                {title}
            </Typography>
            <Typography className=" text-white leading-[1.125rem] line-clamp-3 mb-auto" variant="subtle">
                {description}
            </Typography>
            <Button
                variant="link"
                leftIcon={<IconArrowRight className="text-secondary" size={24} />}
                className="text-secondary px-0"
                onClick={onClick}
                disabled={!onClick}
            >
                {ctaLabel}
            </Button>
        </div>
    );
};

export default NextStepsCard;
