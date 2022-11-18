import type { NextPage } from 'next';
import { useEffect, useState, useMemo } from 'react';

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

import { Helper } from '../../services/helper/helper.service';
import { GetHashPackInformation } from '../../providers/hashpack.provider';

import styles from '../../styles/game.module.css';

const $$client = Client.forTestnet();
const CONTRACTID: string = ContractId.fromString(process.env.NEXT_PUBLIC_CONTRACT_ID || '').toString();
const Game: NextPage = () => {
	const $helper: Helper = useMemo(() => new Helper(), []);
	const { pairingData, network, topic, hashconnect } = GetHashPackInformation();

	const [$loading, $setLoading] = useState(true);
	const [$contractLoading, $setContractLoading] = useState(true);
	const [$playerLimit, $setPlayerLimit] = useState<number>(0);
	const [$playerCount, $setPlayerCount] = useState<number>(0);
	const [$balance, $setBalance] = useState<number>(0);
	const [$price, $setPrice] = useState<number>(0);
	const [$address, $setAddress] = useState<string>('');
	const [$referalAddress, $setReferalAddress] = useState<string>('');

	const handleChangeReferalAddress = (_event: any) => {
		$setReferalAddress(_event.target.value);
	};

	const getInitData = async () => {
		const priceTransaction = new ContractExecuteTransaction()
			.setContractId(CONTRACTID)
			.setGas(3000000)
			.setFunction('getPrice');
		const priceResponse = await priceTransaction.execute($$client);
		const xpriceResponse = await priceResponse.getRecord($$client);
		const xxpriceResponse = await xpriceResponse.contractFunctionResult;
		if (xxpriceResponse) {
			$setPrice(Number(xxpriceResponse.getUint256(0)));
		}

		const playerLimitTransaction = new ContractExecuteTransaction()
			.setContractId(CONTRACTID)
			.setGas(3000000)
			.setFunction('getPlayerLimit');
		const playerLimitResponse = await playerLimitTransaction.execute($$client);
		const xplayerLimitResponse = await playerLimitResponse.getRecord($$client);
		const xxplayerLimitResponse = await xplayerLimitResponse.contractFunctionResult;
		if (xxplayerLimitResponse) {
			$setPlayerLimit(Number(xxplayerLimitResponse.getUint256(0)));
		}

		getPlayerCount();
	};

	const getPlayerCount = async () => {
		const playerCountTransaction = new ContractExecuteTransaction()
			.setContractId(CONTRACTID)
			.setGas(3000000)
			.setFunction('getPlayerCount');
		const playerCountResponse = await playerCountTransaction.execute($$client);
		const xplayerCountResponse = await playerCountResponse.getRecord($$client);
		const xxplayerCountResponse = await xplayerCountResponse.contractFunctionResult;
		if (xxplayerCountResponse) {
			$setPlayerCount(Number(xxplayerCountResponse.getUint256(0)));
		}
	};

	const getBalance = async () => {
		if ($address) {
			const accountBalance = await new AccountBalanceQuery().setAccountId($address).execute($$client);
			$setBalance(Number(accountBalance.hbars.toTinybars()) / 100000000);
		}
	};

	// const startGame = async () => {
	// 	const playerTransaction = new ContractExecuteTransaction()
	// 		.setContractId(CONTRACTID)
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

		const id = pairingData?.accountIds.reduce($helper.conCatAccounts);
		const provider = hashconnect.getProvider(network, topic, id);
		const signer = hashconnect.getSigner(provider);

		const param = new ContractFunctionParameters();
		if ($helper.isNotEmpty($referalAddress)) {
			const addr = AccountId.fromString($referalAddress).toString();
			const addrArr = addr.split('.');
			const addrNum: number = Number(addrArr[2]);
			const addrFinal: string = `000000000000000000000000000000000${addrNum.toString(16).toUpperCase()}`;
			param.addAddress(addrFinal);
		}

		const playerTransaction = new ContractExecuteTransaction()
			.setContractId(CONTRACTID)
			.setGas(300000)
			.setPayableAmount(new Hbar(100))
			.setFunction('setPlayerData', param)
			.freezeWithSigner(signer);

		const playerResponse = await (await playerTransaction).executeWithSigner(signer);
		if (playerResponse && playerResponse.transactionHash) {
			toast('JOIN SUCCESS');
			getBalance();
			getPlayerCount();
		} else {
			toast('JOIN FAILED');
		}

		$setContractLoading(false);
	};

	useEffect(() => {
		if (pairingData) {
			$setAddress(pairingData?.accountIds.reduce($helper.conCatAccounts));
		} else {
			$setAddress('');
		}
		// eslint-disable-next-line
	}, [pairingData]);

	useEffect(() => {
		if (pairingData) {
			getBalance();
			getInitData();
		}
		// eslint-disable-next-line
	}, [$address]);

	useEffect(() => {
		const myPrivateKey: string = PrivateKey.fromString(process.env.NEXT_PUBLIC_TEST_PRIVATE || '').toString();
		const myAccountId: string = AccountId.fromString(process.env.NEXT_PUBLIC_TEST_ACCOUNT || '').toString();
		if (myAccountId && myPrivateKey) {
			$$client.setOperator(myAccountId, myPrivateKey);
		}

		$setContractLoading(false);
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
								<Text> - BALANCE: {$balance}</Text>
								<Text> - PRICE: {$price}</Text>
								<Text> - PLAYER LIMIT: {$playerLimit}</Text>
								<Text> - NUMBER OF PLAYERS: {$playerCount}</Text>
								<Text> - {process.env.NEXT_PUBLIC_TEST_ACCOUNT || ''}</Text>
								<Spacer y={1} />
								{/* <Button size="md" className="full_width" auto onPress={startGame}>
									START GAME
								</Button> */}
								<Spacer y={1} />
								<div className="form">
									<Spacer y={1} />
									<Grid.Container gap={2}>
										<Grid xs={12} md={6}>
											<Input fullWidth readOnly bordered required labelPlaceholder="Address" value={$address} />
										</Grid>
										<Grid xs={12} md={6}>
											<Input
												fullWidth
												clearable
												bordered
												required
												labelPlaceholder="Referal Address"
												onChange={handleChangeReferalAddress}
												value={$referalAddress}
											/>
										</Grid>
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
