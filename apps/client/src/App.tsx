import { Activity, CircleAlert, CircleCheck, Database, LoaderCircle, MonitorSmartphone, Server } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router';

import { getHealth, type HealthResponse } from '@/lib/api';

type HealthState = { status: 'loading' } | { status: 'ready'; data: HealthResponse } | { status: 'error'; message: string };
type PanelIcon = typeof MonitorSmartphone;

export default function App() {
	const [health, setHealth] = useState<HealthState>({ status: 'loading' });

	useEffect(() => {
		const controller = new AbortController();
		getHealth(controller.signal)
			.then((data) => setHealth({ status: 'ready', data }))
			.catch((error: unknown) => {
				if (controller.signal.aborted) {
					return;
				}
				setHealth({
					status: 'error',
					message: error instanceof Error ? error.message : 'Unknown API error',
				});
			});
		return () => controller.abort();
	}, []);

	return (
		<BrowserRouter>
			<AppShell health={health} />
		</BrowserRouter>
	);
}

function AppShell({ health }: { health: HealthState }) {
	return (
		<main className='min-h-screen bg-slate-950 px-6 py-8 text-slate-100'>
			<div className='mx-auto flex max-w-5xl flex-col gap-8'>
				<header className='flex flex-col gap-5 border-b border-white/10 pb-6'>
					<div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
						<div className='space-y-2'>
							<p className='text-sm font-medium uppercase tracking-[0.18em] text-cyan-300'>Template workspace</p>
							<h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>TS Template</h1>
							<p className='max-w-2xl text-sm leading-6 text-slate-300'>
								A compact React and Hono starter with SQLite persistence, typed scripts, and production build wiring.
							</p>
						</div>
						<ApiBadge health={health} />
					</div>
					<nav className='flex flex-wrap gap-2' aria-label='Primary navigation'>
						<RouteLink to='/'>Overview</RouteLink>
						<RouteLink to='/status'>API status</RouteLink>
					</nav>
				</header>

				<Routes>
					<Route index element={<OverviewPage />} />
					<Route path='status' element={<StatusPage health={health} />} />
					<Route path='*' element={<Navigate to='/' replace />} />
				</Routes>
			</div>
		</main>
	);
}

function OverviewPage() {
	return (
		<section className='grid gap-4 md:grid-cols-3'>
			<InfoPanel icon={MonitorSmartphone} label='Client' value='React + Vite' detail='Tailwind-ready app shell' />
			<InfoPanel icon={Server} label='Server' value='Hono routes' detail='Static serving for production builds' />
			<InfoPanel icon={Database} label='Storage' value='Drizzle SQLite' detail='Generated migrations and local data dir' />
		</section>
	);
}

function StatusPage({ health }: { health: HealthState }) {
	return (
		<section className='rounded-lg border border-white/10 bg-white/[0.03] p-5'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h2 className='flex items-center gap-2 text-base font-semibold'>
						<Activity className='size-4 text-cyan-300' aria-hidden='true' />
						API status
					</h2>
					<p className='mt-1 text-sm text-slate-400'>{statusMessage(health)}</p>
				</div>
				<code className='rounded bg-black/30 px-3 py-2 text-sm text-cyan-200'>GET /api/health</code>
			</div>
		</section>
	);
}

function RouteLink({ to, children }: { to: string; children: string }) {
	return (
		<NavLink
			to={to}
			end={to === '/'}
			className={({ isActive }) =>
				`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
					isActive
						? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100'
						: 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white'
				}`
			}
		>
			{children}
		</NavLink>
	);
}

function ApiBadge({ health }: { health: HealthState }) {
	const className =
		health.status === 'ready'
			? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
			: health.status === 'error'
				? 'border-rose-400/30 bg-rose-400/10 text-rose-200'
				: 'border-slate-400/30 bg-slate-400/10 text-slate-200';
	const label = health.status === 'ready' ? 'API online' : health.status === 'error' ? 'API offline' : 'Checking API';
	const Icon = health.status === 'ready' ? CircleCheck : health.status === 'error' ? CircleAlert : LoaderCircle;

	return (
		<span className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${className}`}>
			<Icon className={`size-4 ${health.status === 'loading' ? 'animate-spin' : ''}`} aria-hidden='true' />
			{label}
		</span>
	);
}

function InfoPanel({ icon: Icon, label, value, detail }: { icon: PanelIcon; label: string; value: string; detail: string }) {
	return (
		<div className='rounded-lg border border-white/10 bg-white/[0.03] p-5'>
			<div className='flex items-center gap-2 text-slate-500'>
				<Icon className='size-4' aria-hidden='true' />
				<p className='text-xs font-medium uppercase tracking-[0.16em]'>{label}</p>
			</div>
			<p className='mt-3 text-lg font-semibold text-white'>{value}</p>
			<p className='mt-2 text-sm leading-6 text-slate-400'>{detail}</p>
		</div>
	);
}

function statusMessage(health: HealthState) {
	if (health.status === 'loading') {
		return 'Waiting for the local API response.';
	}
	if (health.status === 'error') {
		return health.message;
	}
	return `${health.data.service} responded at ${new Date(health.data.timestamp).toLocaleString()}.`;
}
