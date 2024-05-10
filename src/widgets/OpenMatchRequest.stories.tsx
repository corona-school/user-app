// @ts-nocheck
import OpenMatchRequest from './OpenMatchRequest';

export default {
    title: 'Organisms/Match/OpenMatchRequest',
    component: OpenMatchRequest,
};

export const BaseOpenMatchRequest = {
    render: () => (
        <OpenMatchRequest
            subjects={[
                {
                    name: 'Englisch',
                },
                {
                    name: 'Deutsch',
                },
            ]}
            cancelLoading={false}
            index={2}
            showCancelMatchRequestModal={() => null}
        />
    ),

    name: 'OpenMatchRequest',
};
