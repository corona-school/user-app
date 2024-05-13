import AlertMessage from './AlertMessage';

export default {
    title: 'Molecules/AlertMessage',
    component: AlertMessage,
};

export const Base = {
    render: () => <AlertMessage content="Du musst bestätigen, dass du diese Nachricht melden möchtest." />,
    name: 'AlertMessage',
};
