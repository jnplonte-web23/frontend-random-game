import type { NextPage } from 'next';
import { useEffect, useState, useMemo } from 'react';

import Head from 'next/head';
import { Container, Card, Text, Grid, Col, Link, Button } from '@nextui-org/react';

import { MainLayout } from '../../layouts';
import { GameCard } from '../../components';

import { Helper } from '../../services/helper/helper.service';
import { GetHashPackInformation } from '../../providers/hashpack.provider';

import styles from '../../styles/game.module.css';

const Game: NextPage = () => {
	const $helper: Helper = useMemo(() => new Helper(), []);
	const { pairingData, network, topic, hashconnect } = GetHashPackInformation();

	const [$loading, $setLoading] = useState<boolean>(true);
	const [$mockData, $setMockData] = useState<number[]>([2, 3, 4, 5]);

	useEffect(() => {
		$setLoading(false);
		// eslint-disable-next-line
	}, []);

	return (
		<MainLayout>
			<Head>
				<title>RANDOM GAME | GAME</title>
				<meta name="description" content="game" />
			</Head>

			<main className={styles.main}>
				{$loading ? (
					'loading...'
				) : (
					<Container className="container">
						<Grid.Container gap={4}>
							<Grid xs={12} lg={4}>
								<GameCard id={1} active={true} image="https://api.lorem.space/image/car?w=300&h=300&hash=8B7BCDC0" />
							</Grid>
							{$mockData.map((mData) => (
								<Grid xs={12} lg={4} key={mData}>
									<GameCard
										key={mData}
										id={mData}
										active={false}
										image={`https://api.lorem.space/image/car?w=300&h=300&hash=8B7BCDC${mData}`}
									/>
								</Grid>
							))}
						</Grid.Container>
					</Container>
				)}
			</main>
		</MainLayout>
	);
};

export default Game;
