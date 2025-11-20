import Registration from '@/pages/Registration';
import { RegistrationProvider } from '@/pages/registration/useRegistrationForm';

export default function RegistrationLazy() {
    return (
        <RegistrationProvider>
            <Registration />
        </RegistrationProvider>
    );
}
