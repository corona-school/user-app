import { Text } from 'native-base';

type Props = {
    bulletPoints: String[];
};

const BulletList: React.FC<Props> = ({ bulletPoints }) => {
    return (
        <>
            {bulletPoints.map((bullet, index) => (
                <Text key={index}>● {bullet}</Text>
            ))}
        </>
    );
};

export default BulletList;
