import type { AppProps } from 'next/app';

import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
	const $darkTheme = createTheme({
		type: 'dark',
	});

	return (
		<div className="root_container">
			<NextThemesProvider
				defaultTheme="system"
				attribute="class"
				value={{
					dark: $darkTheme.className,
				}}
			>
				<NextUIProvider>
					<Component className="container" {...pageProps} />
				</NextUIProvider>
			</NextThemesProvider>
		</div>
	);
}

export default MyApp;
