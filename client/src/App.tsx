import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router';
import { Toaster } from 'sonner';
import { Loader } from './components/custom/Loader.tsx';
import NetworkBanner from './components/custom/NetworkBanner.tsx';
import AuthenticatedRoute from './components/routes/AuthenticatedRoute.tsx';
import { idbPersister } from './lib/clients/idb.client';
import queryClient from './lib/clients/query.client';
import { setZodLocale } from './lib/utils/zod.utils.ts';
import { useAuthStore } from './stores/useAuthStore.ts';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Summary = lazy(() => import('./pages/Summary'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Bills = lazy(() => import('./pages/Bills'));
const Accounts = lazy(() => import('./pages/Accounts'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const { i18n } = useTranslation();

	useEffect(() => {
		setZodLocale(i18n.language);
		// set default language to en if not set
		if (i18n.language !== 'en') {
			i18n.changeLanguage('en');
		}
	}, [i18n, i18n.language]);

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{
				persister: idbPersister,
				maxAge: 1000 * 60 * 60 * 2, // 2 hours
			}}
		>
			<NetworkBanner />
			<Toaster />
			<Suspense fallback={<Loader />}>
				<main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
					<Routes>
						{!isAuthenticated && (
							<Route path="/" element={<Home />} />
						)}
						{isAuthenticated && (
							<Route element={<AuthenticatedRoute />}>
								<Route path="/" element={<Summary />} />
							</Route>
						)}
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route element={<AuthenticatedRoute />}>
							<Route
								path="/transactions"
								element={<Transactions />}
							/>
							<Route path="/bills" element={<Bills />} />
							<Route path="/accounts" element={<Accounts />} />
							<Route path="/settings" element={<Settings />} />
						</Route>
					</Routes>
				</main>
			</Suspense>
		</PersistQueryClientProvider>
	);
}

export default App;
