'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
	label: string;
	href: string;
	icon: JSX.Element;
}

function Item({ item, active }: { item: NavItem; active: boolean }) {
	return (
		<Link
			href={item.href}
			className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
				active
					? 'bg-blue-50 text-blue-700'
					: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
			}`}
		>
			<span className="shrink-0">{item.icon}</span>
			<span className="truncate">{item.label}</span>
		</Link>
	);
}

export default function Sidebar({ collapsed = false, onToggle }: { collapsed?: boolean; onToggle?: () => void }) {
	const pathname = usePathname();

	const items: NavItem[] = [
		{
			label: 'Overview',
			href: '/dashboard',
			icon: (
				<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
				</svg>
			),
		},
		{
			label: 'Research Assistant',
			href: '#',
			icon: (
				<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
				</svg>
			),
		},
		{
			label: 'Research Reports',
			href: '#',
			icon: (
				<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h6" />
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h6m0 0v6m0-6L10 16" />
				</svg>
			),
		},
		{
			label: 'API Playground',
			href: '#',
			icon: (
				<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
				</svg>
			),
		},
		{
			label: 'Invoices',
			href: '#',
			icon: (
				<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l2-2m0 0l2-2m-2 2l2 2m-2-2L9 10m12 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			),
		},
		{
			label: 'Documentation',
			href: '#',
			icon: (
				<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l9-5-9-5-9 5 9 5z" />
				</svg>
			),
		},
	];

	return (
		<aside className={`sticky top-0 h-screen shrink-0 border-r bg-white py-6 ${collapsed ? 'w-16 px-2' : 'w-64 px-4'}`}>
			<div className={`mb-6 flex items-center justify-between ${collapsed ? 'px-0' : 'px-2'}`}>
				<div className={`text-lg font-semibold ${collapsed ? 'text-center w-full' : ''}`}>{collapsed ? 'd' : 'dandi'}</div>
				{onToggle && (
					<button
						onClick={onToggle}
						className={`rounded-lg border px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 ${collapsed ? 'hidden' : ''}`}
						aria-label="Collapse sidebar"
					>
						⟨
					</button>
				)}
			</div>
			<nav className="space-y-1">
				{items.map((item) => (
					<div key={item.label}>
						{collapsed ? (
							<Link
								href={item.href}
								className={`flex items-center justify-center rounded-xl p-3 text-sm transition-colors ${
									pathname === item.href ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
								}`}
							>
								{item.icon}
							</Link>
						) : (
							<Item item={item} active={pathname === item.href} />
						)}
					</div>
				))}
			</nav>
			{onToggle && collapsed && (
				<div className="absolute bottom-4 left-0 right-0 flex justify-center">
					<button
						onClick={onToggle}
						className="rounded-lg border px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
						aria-label="Expand sidebar"
					>
						⟩
					</button>
				</div>
			)}
		</aside>
	);
}


