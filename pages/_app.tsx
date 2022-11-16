import type { AppProps } from 'next/app';

import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import 'react-toastify/dist/ReactToastify.css';
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
					<ToastContainer
						position="top-right"
						autoClose={5000}
						hideProgressBar={true}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="dark"
					/>
					<Component className="container" {...pageProps} />
				</NextUIProvider>
			</NextThemesProvider>
		</div>
	);
}

export default MyApp;
