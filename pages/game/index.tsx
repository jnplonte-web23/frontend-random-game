import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import { Container, Card, Text, Grid, Input, Spacer, Button } from '@nextui-org/react';

import Head from 'next/head';

import {
	Client,
	PrivateKey,
	AccountId,
	AccountBalanceQuery,
	ContractExecuteTransaction,
	ContractFunctionParameters,
	ContractId,
	Hbar,
} from '@hashgraph/sdk';

import { MainLayout } from '../../layouts';

import styles from '../../styles/game.module.css';

const Game: NextPage = () => {
	const $client = Client.forTestnet();

	const [$loading, $setLoading] = useState(true);
	const [$playerLimit, $setPlayerLimit] = useState<number>(0);
	const [$price, $setPrice] = useState<number>(0);
	const [$address, $setAddress] = useState<string>('');
	// const [$referalAddress, $setReferalAddress] = useState<string>('');

	// const handleChangeReferalAddress = (_event: any) => {
	// 	$setReferalAddress(_event.target.value);
	// };

	const getInitData = async () => {
		const contractId: string = ContractId.fromString(process.env.NEXT_PUBLIC_CONTRACT_ID || '').toString();
		const priceTransaction = new ContractExecuteTransaction()
			.setContractId(contractId)
			.setGas(3000000)
			.setFunction('getPrice');

		const priceResponse = await priceTransaction.execute($client);
		const xpriceResponse = await priceResponse.getRecord($client);
		const xxpriceResponse = await xpriceResponse.contractFunctionResult;
		if (xxpriceResponse) {
			$setPrice(Number(xxpriceResponse.getUint256(0)));
		}

		const playerLimitTransaction = new ContractExecuteTransaction()
			.setContractId(contractId)
			.setGas(3000000)
			.setFunction('getPlayerLimit');

		const playerLimitResponse = await playerLimitTransaction.execute($client);
		const xplayerLimitResponse = await playerLimitResponse.getRecord($client);
		const xxplayerLimitResponse = await xplayerLimitResponse.contractFunctionResult;
		if (xxplayerLimitResponse) {
			$setPlayerLimit(Number(xxplayerLimitResponse.getUint256(0)));
		}
	};

	const getBalance = async (_myAccountId: any) => {
		const accountBalance = await new AccountBalanceQuery().setAccountId(_myAccountId).execute($client);
		console.log('balance', Number(accountBalance.hbars.toTinybars()) / 100000000);
	};

	const joinGame = async () => {
		const contractId: string = ContractId.fromString(process.env.NEXT_PUBLIC_CONTRACT_ID || '').toString();
		const param = new ContractFunctionParameters();
		param.addAddress('0000000000000000000000000000000002E80425');
		const playerTransaction = new ContractExecuteTransaction()
			.setContractId(contractId)
			.setGas(300000)
			.setPayableAmount(new Hbar(100))
			.setFunction('setPlayerData', param);

		const playerLimitResponse = await playerTransaction.execute($client);
		const receipt = await playerLimitResponse.getReceipt($client);
		const transactionStatus = receipt.status;

		console.log('The transaction status is ', transactionStatus);
	};

	useEffect(() => {
		const myPrivateKey = PrivateKey.fromString(process.env.NEXT_PUBLIC_TEST_PRIVATE || '');
		const myAccountId: string = AccountId.fromString(process.env.NEXT_PUBLIC_TEST_ACCOUNT || '').toString();
		if (myAccountId && myPrivateKey) {
			$client.setOperator(myAccountId, myPrivateKey);
			$setAddress(myAccountId);

			getBalance(myAccountId);
			getInitData();
		}

		$setLoading(false);
		// eslint-disable-next-line
	}, []);

	return (
		<MainLayout>
			<Head>
				<title>RANDOM GAME | Game</title>
				<meta name="description" content="game" />
				<link rel="shortcut icon" href="/" />
			</Head>

			<main className={styles.main}>
				{$loading ? (
					'loading...'
				) : (
					<Container className="container">
						<Card className="card">
							<Card.Body>
								<Text> - PRICE: {$price}</Text>
								<Text> - PLAYER LIMIT: {$playerLimit}</Text>
								<Text> - NUMBER OF PLAYERS: 0</Text>
								<Spacer y={1} />
								<div className="form">
									<Spacer y={1} />
									<Grid.Container gap={2}>
										<Grid xs={12} md={12}>
											<Input fullWidth readOnly bordered required labelPlaceholder="Address" initialValue={$address} />
										</Grid>
										{/* <Grid xs={12} md={6}>
											<Input
												fullWidth
												clearable
												bordered
												required
												labelPlaceholder="Referal Address"
												onChange={handleChangeReferalAddress}
												initialValue={$referalAddress}
											/>
										</Grid> */}
									</Grid.Container>
									<Spacer y={1} />
									<Grid.Container gap={2}>
										<Grid xs={12} md={12}>
											<Button size="md" className="full_width" auto onPress={joinGame}>
												JOIN GAME
											</Button>
										</Grid>
									</Grid.Container>
								</div>
							</Card.Body>
						</Card>
					</Container>
				)}
			</main>
		</MainLayout>
	);
};

export default Game;
