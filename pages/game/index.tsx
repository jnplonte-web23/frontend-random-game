import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import Head from 'next/head';

import { MainLayout } from '../../layouts';

import styles from '../../styles/about-us.module.css';

const Game: NextPage = () => {
	const [$loading, $setLoading] = useState(true);

	useEffect(() => {
		$setLoading(false);
	}, []);

	return (
		<MainLayout>
			<Head>
				<title>RANDOM GAME | Game</title>
				<meta name="description" content="game" />
				<link rel="shortcut icon" href="/" />
			</Head>

			<main className={styles.main}>
				<>{$loading ? 'loading...' : 'GAME'}</>
			</main>
		</MainLayout>
	);
};

export default Game;
