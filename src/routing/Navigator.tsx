import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';

import CenterLoadingSpinner from '../components/CenterLoadingSpinner';

// These Pages are loaded initially:
import Login from '../pages/Login';
import Welcome from '../pages/Welcome';
import LoginToken from '../pages/LoginToken';
import { RequireAuth } from '../User';
import FullPageModal from '../modals/FullPageModal';
import { lazyWithRetry } from '../lazy';
import Logout from '../components/Logout';

// All other pages load lazy:
const NavigatorLazy = lazyWithRetry(() => import('./NavigatorLazy'), { prefetch: true });

// This component only exists to reliably test our support process:
function CrashMe() {
    return ({} as any).very.stupid;
}

export default function Navigator() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/login-token" element={<LoginToken />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/welcome" element={<Welcome />} />

                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <Navigate to="/start" />
                        </RequireAuth>
                    }
                />

                <Route
                    path="*"
                    element={
                        <Suspense fallback={<CenterLoadingSpinner />}>
                            <NavigatorLazy />
                        </Suspense>
                    }
                />

                <Route path="/crash-me" element={<CrashMe />} />
            </Routes>
            <FullPageModal />
        </>
    );
}
