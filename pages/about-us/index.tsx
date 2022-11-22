import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import Head from 'next/head';

import { MainLayout } from '../../layouts';

import styles from '../../styles/about-us.module.css';

const AboutUs: NextPage = () => {
	const [$loading, $setLoading] = useState(true);

	useEffect(() => {
		$setLoading(false);
	}, []);

	return (
		<MainLayout>
			<Head>
				<title>RANDOM GAME | ABOUT US</title>
				<meta name="description" content="about us" />
			</Head>

			<main className={styles.main}>
				<>{$loading ? 'loading...' : 'ABOUT US'}</>
			</main>
		</MainLayout>
	);
};

export default AboutUs;
