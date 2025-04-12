import { useLocation } from 'preact-iso';

export function Header() {
	const { url } = useLocation();

	return (
		<header>
			<nav>
				<a href="/" class={url == '/' && 'active'}>
					Home
				</a>
				<a href="/settings" class={url == '/settings' && 'active'}>
				  Settings
				</a>
			</nav>
		</header>
	);
}
