import type { NextPage } from 'next';
import { useEffect, useState, useMemo } from 'react';

import Head from 'next/head';
import { Container, Card, Text, Grid, Col, Link, Button } from '@nextui-org/react';

import { MainLayout } from '../../layouts';

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
								<Card css={{ w: '100%', h: '400px' }}>
									<Card.Header css={{ position: 'absolute', zIndex: 1, top: 5 }}>
										<Col>
											<Text size={12} weight="bold" transform="uppercase" color="yellow">
												NEW GAME !!!
											</Text>
											<Text h3 color="black">
												RANDOM GAME 1
											</Text>
										</Col>
									</Card.Header>
									<Card.Body css={{ p: 0 }}>
										<Card.Image
											src="https://picsum.photos/seed/picsum/300/300"
											width="100%"
											height="100%"
											objectFit="cover"
											alt="random game 1"
										/>
									</Card.Body>
									<Card.Footer
										isBlurred
										css={{
											position: 'absolute',
											bgBlur: '#ffffff66',
											borderTop: '$borderWeights$light solid rgba(255, 255, 255, 0.2)',
											bottom: 0,
											zIndex: 1,
										}}
									>
										<Grid.Container gap={0}>
											<Grid xs={6} lg={8}>
												<Col>
													<Text color="#333" size={18}>
														PRICE: 100 HBAR
													</Text>
													<Text color="#333" size={12} className="hide_xs">
														Lorem ipsum dolor sit amet, consectetur adipiscing elit consectetur adipiscing elit...
													</Text>
												</Col>
											</Grid>
											<Grid xs={6} lg={4} justify="flex-end">
												<Button auto>
													<Link href="/game/1">
														<Text color="#fff" size={12} weight="bold">
															JOIN GAME
														</Text>
													</Link>
												</Button>
											</Grid>
										</Grid.Container>
									</Card.Footer>
								</Card>
							</Grid>

							{$mockData.map((mData) => (
								<Grid xs={12} lg={4} key={mData}>
									<Card css={{ w: '100%', h: '400px' }}>
										<Card.Header css={{ position: 'absolute', zIndex: 1, top: 5 }}>
											<Col>
												<Text size={12} weight="bold" transform="uppercase" color="yellow">
													&nbsp;
												</Text>
												<Text h3 color="black">
													{`RANDOM GAME ${mData}`}
												</Text>
											</Col>
										</Card.Header>
										<Card.Body css={{ p: 0 }}>
											<Card.Image
												src="https://picsum.photos/300/300"
												width="100%"
												height="100%"
												objectFit="cover"
												alt={`game ${mData}`}
											/>
										</Card.Body>
										<Card.Footer
											isBlurred
											css={{
												position: 'absolute',
												bgBlur: '#ffffff66',
												borderTop: '$borderWeights$light solid rgba(255, 255, 255, 0.2)',
												bottom: 0,
												zIndex: 1,
											}}
										>
											<Grid.Container gap={0}>
												<Grid xs={12} lg={8}>
													<Col>
														<Text color="#333" size={18}>
															PRICE: 100 HBAR
														</Text>
														<Text color="#333" size={12} className="hide_xs">
															Lorem ipsum dolor sit amet, consectetur adipiscing elit consectetur adipiscing elit...
														</Text>
													</Col>
												</Grid>
												<Grid xs={12} lg={4} justify="flex-end">
													<Button disabled auto>
														<Link href={`/game/${mData}`}>
															<Text color="#fff" size={12} weight="bold">
																JOIN GAME
															</Text>
														</Link>
													</Button>
												</Grid>
											</Grid.Container>
										</Card.Footer>
									</Card>
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
