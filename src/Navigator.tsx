import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import CenterLoadingSpinner from './components/CenterLoadingSpinner';

// These Pages are loaded initially:
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import LoginToken from './pages/LoginToken';
import { RequireAuth } from './User';
import FullPageModal from './widgets/FullPageModal';

// All other pages load lazy:
const NavigatorLazy = lazy(() => import('./NavigatorLazy'));

// But as after login the user will visit the dashboard anyways, let's start loading it already
import('./NavigatorLazy');

export default function Navigator() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/login-token" element={<LoginToken />} />

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
            </Routes>
            <FullPageModal />
        </BrowserRouter>
    );
}
