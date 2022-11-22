import type { NextPage } from 'next';
import { useRouter } from 'next/router';
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
	const $router = useRouter();
	const { id } = $router.query;
	console.log(id, '<<<< GAME ID');

	const $helper: Helper = useMemo(() => new Helper(), []);
	const { pairingData, network, topic, hashconnect } = GetHashPackInformation();

	const [$loading, $setLoading] = useState(true);
	const [$contractLoading, $setContractLoading] = useState(true);
	const [$gameStart, $setGameStart] = useState(false);
	const [$playerLimit, $setPlayerLimit] = useState<number>(0);
	const [$playerCount, $setPlayerCount] = useState<number>(0);
	const [$balance, $setBalance] = useState<number>(0);
	const [$price, $setPrice] = useState<number>(0);
	const [$address, $setAddress] = useState<string>('');
	const [$referalAddress, $setReferalAddress] = useState<string>(process.env.NEXT_PUBLIC_TEST_ACCOUNT || '');

	const handleChangeReferalAddress = (_event: any) => {
		$setReferalAddress(_event.target.value);
	};

	const getInitData = async () => {
		const gameTransaction = new ContractExecuteTransaction()
			.setContractId(CONTRACTID)
			.setGas(3000000)
			.setFunction('getGameStart');
		const gameResponse = await gameTransaction.execute($$client);
		const xgameResponse = await gameResponse.getRecord($$client);
		const xxgameResponse = await xgameResponse.contractFunctionResult;

		if (xxgameResponse) {
			$setGameStart(xxgameResponse.getBool(0));
		}

		// const priceTransaction = new ContractExecuteTransaction()
		// 	.setContractId(CONTRACTID)
		// 	.setGas(3000000)
		// 	.setFunction('getPrice');
		// const priceResponse = await priceTransaction.execute($$client);
		// const xpriceResponse = await priceResponse.getRecord($$client);
		// const xxpriceResponse = await xpriceResponse.contractFunctionResult;
		// if (xxpriceResponse) {
		// 	$setPrice(Number(xxpriceResponse.getUint256(0)));
		// }

		// const playerLimitTransaction = new ContractExecuteTransaction()
		// 	.setContractId(CONTRACTID)
		// 	.setGas(3000000)
		// 	.setFunction('getPlayerLimit');
		// const playerLimitResponse = await playerLimitTransaction.execute($$client);
		// const xplayerLimitResponse = await playerLimitResponse.getRecord($$client);
		// const xxplayerLimitResponse = await xplayerLimitResponse.contractFunctionResult;
		// if (xxplayerLimitResponse) {
		// 	$setPlayerLimit(Number(xxplayerLimitResponse.getUint256(0)));
		// }

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

	const startGame = async () => {
		const playerTransaction = new ContractExecuteTransaction()
			.setContractId(CONTRACTID)
			.setGas(300000)
			.setFunction('startGame');

		const playerLimitResponse = await playerTransaction.execute($$client);
		const receipt = await playerLimitResponse.getReceipt($$client);

		if (Number(receipt.status) === 22) {
			toast('START GAME');
			$setGameStart(true);
		}
	};

	const winGame = async () => {
		try {
			const playerTransaction = new ContractExecuteTransaction()
				.setContractId(CONTRACTID)
				.setGas(300000)
				.setFunction('setWinner');

			const playerLimitResponse = await playerTransaction.execute($$client);
			const receipt = await playerLimitResponse.getReceipt($$client);

			if (Number(receipt.status) === 22) {
				const param = new ContractFunctionParameters();
				param.addUint8(1);
				const win1Transaction = new ContractExecuteTransaction()
					.setContractId(CONTRACTID)
					.setGas(3000000)
					.setFunction('getWinnerList', param);
				const win1Response = await win1Transaction.execute($$client);
				const xwin1Response = await win1Response.getRecord($$client);
				const xxwin1Response = await xwin1Response.contractFunctionResult;
				if (xxwin1Response) {
					toast(`WINER ${xxwin1Response.getAddress(0)}`);
				} else {
					toast('WINNER SUCCESS');
				}
			}
		} catch (error) {
			toast(`WINNER FAILED`, $helper.toString(error));
		}
	};

	const joinGame = async () => {
		$setContractLoading(true);

		try {
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
		} catch (error) {
			toast(`JOIN FAILED`, $helper.toString(error));
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
		}
		// eslint-disable-next-line
	}, [$address]);

	useEffect(() => {
		const myPrivateKey: string = PrivateKey.fromString(process.env.NEXT_PUBLIC_TEST_PRIVATE || '').toString();
		const myAccountId: string = AccountId.fromString(process.env.NEXT_PUBLIC_TEST_ACCOUNT || '').toString();
		if (myAccountId && myPrivateKey) {
			$$client.setOperator(myAccountId, myPrivateKey);
			getInitData();
		}

		$setContractLoading(false);
		$setLoading(false);
		// eslint-disable-next-line
	}, []);

	return (
		<MainLayout>
			<Head>
				<title>{`RANDOM GAME | GAME ${id}`}</title>
				<meta name="description" content={`game ${id}`} />
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
								<Spacer y={1} />
								{!$gameStart ? (
									<Button size="md" className="full_width" auto onPress={startGame}>
										START GAME
									</Button>
								) : (
									'GAME STARTED'
								)}
								<Spacer y={1} />
								<Button size="md" className="full_width" auto onPress={winGame}>
									WIN GAME
								</Button>
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
