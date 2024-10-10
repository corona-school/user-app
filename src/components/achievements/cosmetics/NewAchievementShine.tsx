import ShimmerIcon from '@/assets/icons/icon_shimmer.svg';
import { cn } from '@/lib/Tailwind';

const NewAchievementShine = () => {
    const stars = [
        'size-7 right-[10%] bottom-[40px] animate-[shine_5s_infinite]',
        'size-7 right-[35%] bottom-[30px] animate-[shine_9s_infinite]',
        'size-5 right-[50%] bottom-[50px] animate-[shine_7.5s_infinite]',
        'size-4 right-[70%] bottom-[15px] animate-[shine_6s_infinite]',
        'size-8 right-[90%] bottom-[20px] animate-[shine_5.5s_infinite]',
    ];

    return (
        <>
            {stars.map((classes, index) => (
                <div key={index} className={cn('right- flex items-center justify-center absolute', classes)}>
                    <ShimmerIcon className="size-7" />
                </div>
            ))}
        </>
    );
};

export default NewAchievementShine;
