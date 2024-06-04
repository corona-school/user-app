import AppointmentsEmptyState from './AppointmentsEmptyState';

export default {
    title: 'Organisms/Appointments/AppointmentsEmptyState',
    component: AppointmentsEmptyState,
};

export const Base = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
            }}
        >
            <AppointmentsEmptyState title={'Keine Termine'} subtitle={'Dir wurden aktuell noch keine Termine zugeordnet'} />
            <AppointmentsEmptyState title={'Keine weiteren Termine'} subtitle={'Scrolle nach oben, um vergangene Termine zu sehen'} />
            <AppointmentsEmptyState title={'Keine Termine'} subtitle={'Erstelle nun den ersten Kurstermin'} />
            <AppointmentsEmptyState title={'Keine Termine'} subtitle={'Es wurden noch keine Termine veröffentlicht'} />
        </div>
    ),

    name: 'AppointmentsEmptyState',
};
