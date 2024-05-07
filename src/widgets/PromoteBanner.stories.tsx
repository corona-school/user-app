import PromoteBanner from './PromoteBanner';

export default {
    title: 'Organisms/Courses/PromoteBanner',
    component: PromoteBanner,
};

export const BasePromoteBanner = {
    render: () => (
        <PromoteBanner canNotPromote={false} isPromoted={true} onClick={() => console.log('promote')} courseStatus="free" seatsFull={10} seatsMax={10} />
    ),

    name: 'Promote Banner',
};
