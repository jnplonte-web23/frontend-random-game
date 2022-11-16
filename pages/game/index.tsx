import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import { Container, Card, Text, Grid, Input, Spacer, Button, Loading } from '@nextui-org/react';
import { toast } from 'react-toastify';

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

const $$client = Client.forTestnet();
const Game: NextPage = () => {
	const [$loading, $setLoading] = useState(true);
	const [$contractLoading, $setContractLoading] = useState(true);
	const [$playerLimit, $setPlayerLimit] = useState<number>(0);
	const [$balance, $setBalance] = useState<number>(0);
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

		const priceResponse = await priceTransaction.execute($$client);
		const xpriceResponse = await priceResponse.getRecord($$client);
		const xxpriceResponse = await xpriceResponse.contractFunctionResult;
		if (xxpriceResponse) {
			$setPrice(Number(xxpriceResponse.getUint256(0)));
		}

		const playerLimitTransaction = new ContractExecuteTransaction()
			.setContractId(contractId)
			.setGas(3000000)
			.setFunction('getPlayerLimit');

		const playerLimitResponse = await playerLimitTransaction.execute($$client);
		const xplayerLimitResponse = await playerLimitResponse.getRecord($$client);
		const xxplayerLimitResponse = await xplayerLimitResponse.contractFunctionResult;
		if (xxplayerLimitResponse) {
			$setPlayerLimit(Number(xxplayerLimitResponse.getUint256(0)));
		}
	};

	const getBalance = async () => {
		if ($address) {
			const accountBalance = await new AccountBalanceQuery().setAccountId($address).execute($$client);
			$setBalance(Number(accountBalance.hbars.toTinybars()) / 100000000);
		}
	};

	// const startGane = async () => {
	// 	const contractId: string = ContractId.fromString(process.env.NEXT_PUBLIC_CONTRACT_ID || '').toString();
	// 	const playerTransaction = new ContractExecuteTransaction()
	// 		.setContractId(contractId)
	// 		.setGas(300000)
	// 		.setFunction('startGame');

	// 	const playerLimitResponse = await playerTransaction.execute($$client);

	// 	//Request the receipt of the transaction
	// 	const receipt = await playerLimitResponse.getReceipt($$client);
	// 	//Get the transaction consensus status
	// 	const transactionStatus = receipt.status;

	// 	console.log('The transaction consensus status is ' + transactionStatus);
	// };

	const joinGame = async () => {
		$setContractLoading(true);

		const contractId: string = ContractId.fromString(process.env.NEXT_PUBLIC_CONTRACT_ID || '').toString();
		const param = new ContractFunctionParameters();
		param.addAddress('0000000000000000000000000000000002E80425');
		const playerTransaction = new ContractExecuteTransaction()
			.setContractId(contractId)
			.setGas(300000)
			.setPayableAmount(new Hbar(100))
			.setFunction('setPlayerData', param);

		const playerLimitResponse = await playerTransaction.execute($$client);

		//Request the receipt of the transaction
		const receipt = await playerLimitResponse.getReceipt($$client);
		console.log(receipt, 'receiptreceiptreceipt');
		if (receipt.status) {
			toast('JOIN SUCCESS');
			getBalance();
		}

		$setContractLoading(false);
	};

	useEffect(() => {
		const myPrivateKey = PrivateKey.fromString(process.env.NEXT_PUBLIC_TEST_PRIVATE || '');
		const myAccountId: string = AccountId.fromString(process.env.NEXT_PUBLIC_TEST_ACCOUNT || '').toString();
		if (myAccountId && myPrivateKey) {
			$$client.setOperator(myAccountId, myPrivateKey);
			$setAddress(myAccountId);
		}

		$setLoading(false);
		$setContractLoading(false);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		getBalance();
		getInitData();
		// eslint-disable-next-line
	}, [$address]);

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
								<Text> - BALANCE: {$balance}</Text>
								<Text> - PRICE: {$price}</Text>
								<Text> - PLAYER LIMIT: {$playerLimit}</Text>
								<Text> - NUMBER OF PLAYERS: 0</Text>
								<Spacer y={1} />
								{/* <Button size="md" className="full_width" auto onPress={startGane}>
									START GAME
								</Button> */}
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
											{$contractLoading ? (
												<div className="full_width text_center">
													<Loading type="points" size="xl" />
												</div>
											) : (
												<Button size="md" className="full_width" auto onPress={joinGame}>
													JOIN GAME
												</Button>
											)}
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
