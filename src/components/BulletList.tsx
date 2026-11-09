import { Typography } from '@/components/Typography';

type Props = {
    bulletPoints: String[];
};

const BulletList: React.FC<Props> = ({ bulletPoints }) => {
    return (
        <>
            {bulletPoints.map((bullet, index) => (
                <Typography variant="subtle" key={index}>
                    ● {bullet}
                </Typography>
            ))}
        </>
    );
};

export default BulletList;
