import type { NextPage } from 'next';
import { useEffect, useState, useMemo } from 'react';

import { Container, Grid, Spacer, Button, Input } from '@nextui-org/react';
import { toast } from 'react-toastify';

import Head from 'next/head';

import {
	Client,
	PrivateKey,
	AccountId,
	ContractExecuteTransaction,
	ContractFunctionParameters,
	ContractId,
} from '@hashgraph/sdk';

import { MainLayout } from '../../layouts';

import { Helper } from '../../services/helper/helper.service';
import { GetHashPackInformation } from '../../providers/hashpack.provider';

import styles from '../../styles/admin.module.css';

const $$client = Client.forTestnet();
const CONTRACTID: string = ContractId.fromString(process.env.NEXT_PUBLIC_CONTRACT_ID || '').toString();
const Admin: NextPage = () => {
	const $helper: Helper = useMemo(() => new Helper(), []);
	const { pairingData } = GetHashPackInformation();

	const [$loading, $setLoading] = useState(true);
	const [$accountId, $setAccountId] = useState('');

	const [$gameStart, $setGameStart] = useState(true);
	const [$numberOfWinners, $setNumberOfWinners] = useState<number>(1);
	const [$numberOfPlayers, $setNumberOfPlayers] = useState<number>(100);
	const [$currentPlayers, $setCurrentPlayers] = useState<number>(0);

	const [$winner1, $setWinner1] = useState('');
	const [$winner2, $setWinner2] = useState('');
	const [$winner3, $setWinner3] = useState('');

	const handleChangeNumberOfWinners = (_event: any) => {
		$setNumberOfWinners(Number(_event.target.value));
	};

	const handleChangeNumberOfPlayers = (_event: any) => {
		$setNumberOfPlayers(Number(_event.target.value));
	};

	const getInitData = async () => {
		const gameTransaction = new ContractExecuteTransaction()
			.setContractId(CONTRACTID)
			.setGas(3000000)
			.setFunction('isGameStart');
		const gameResponse = await gameTransaction.execute($$client);
		const xgameResponse = await gameResponse.getRecord($$client);
		const xxgameResponse = await xgameResponse.contractFunctionResult;
		if (xxgameResponse) {
			$setGameStart(xxgameResponse.getBool(0));
		}

		const playerLimitTransaction = new ContractExecuteTransaction()
			.setContractId(CONTRACTID)
			.setGas(3000000)
			.setFunction('getPlayerLimit');
		const playerLimitResponse: any = await playerLimitTransaction.execute($$client);
		const xplayerLimitResponse: any = await playerLimitResponse.getRecord($$client);
		const xxplayerLimitResponse: any = await xplayerLimitResponse.contractFunctionResult;
		if (xxplayerLimitResponse) {
			$setNumberOfPlayers(Number(xxplayerLimitResponse.getUint256(0)));
		}

		const playerCountTransaction = new ContractExecuteTransaction()
			.setContractId(CONTRACTID)
			.setGas(3000000)
			.setFunction('getPlayerCount');
		const playerCountResponse: any = await playerCountTransaction.execute($$client);
		const xplayerCountResponse: any = await playerCountResponse.getRecord($$client);
		const xxplayerCountResponse: any = await xplayerCountResponse.contractFunctionResult;
		if (xxplayerCountResponse) {
			$setCurrentPlayers(Number(xxplayerCountResponse.getUint256(0)));
		}
	};

	const startGame = async () => {
		try {
			const param = new ContractFunctionParameters();
			param.addUint256(10);
			const playerTransaction = new ContractExecuteTransaction()
				.setContractId(CONTRACTID)
				.setGas(300000)
				.setFunction('startGame', param);

			const playerResponse = await playerTransaction.execute($$client);
			const receipt = await playerResponse.getReceipt($$client);

			if (Number(receipt.status) === 22) {
				toast('START GAME');
				$setGameStart(true);
			}
		} catch (error) {
			toast(`START FAILED`, $helper.toString(error));
		}
	};

	const stopGame = async () => {
		try {
			const playerTransaction = new ContractExecuteTransaction()
				.setContractId(CONTRACTID)
				.setGas(300000)
				.setFunction('stopGame');

			const playerResponse = await playerTransaction.execute($$client);
			const receipt = await playerResponse.getReceipt($$client);

			if (Number(receipt.status) === 22) {
				toast('STOP GAME');
				$setGameStart(false);
			}
		} catch (error) {
			toast(`STOP FAILED`, $helper.toString(error));
		}
	};

	const winGame = async () => {
		try {
			const param = new ContractFunctionParameters();
			param.addUint8($numberOfWinners);
			const winnerTransaction = new ContractExecuteTransaction()
				.setContractId(CONTRACTID)
				.setGas(300000)
				.setFunction('setWinner', param);

			const winnerResponse = await winnerTransaction.execute($$client);
			const receipt = await winnerResponse.getReceipt($$client);

			if (Number(receipt.status) === 22) {
				toast('WINNER SUCCESS');
			}
		} catch (error) {
			toast(`WINNER FAILED`, $helper.toString(error));
		}
	};

	const getWinner = async () => {
		try {
			const param1 = new ContractFunctionParameters();
			param1.addUint8(1);
			const win1Transaction1 = new ContractExecuteTransaction()
				.setContractId(CONTRACTID)
				.setGas(3000000)
				.setFunction('getWinnerList', param1);
			const win1Response1 = await win1Transaction1.execute($$client);
			const xwin1Response1 = await win1Response1.getRecord($$client);
			const xxwin1Response1 = await xwin1Response1.contractFunctionResult;
			if (xxwin1Response1) {
				$setWinner1(`0.0.${parseInt(xxwin1Response1.getAddress(0), 16)}`);
			}

			const param2 = new ContractFunctionParameters();
			param2.addUint8(2);
			const win1Transaction2 = new ContractExecuteTransaction()
				.setContractId(CONTRACTID)
				.setGas(3000000)
				.setFunction('getWinnerList', param2);
			const win1Response2 = await win1Transaction2.execute($$client);
			const xwin1Response2 = await win1Response2.getRecord($$client);
			const xxwin1Response2 = await xwin1Response2.contractFunctionResult;
			if (xxwin1Response2) {
				$setWinner2(`0.0.${parseInt(xxwin1Response2.getAddress(0), 16)}`);
			}

			const param3 = new ContractFunctionParameters();
			param3.addUint8(3);
			const win1Transaction3 = new ContractExecuteTransaction()
				.setContractId(CONTRACTID)
				.setGas(3000000)
				.setFunction('getWinnerList', param3);
			const win1Response3 = await win1Transaction3.execute($$client);
			const xwin1Response3 = await win1Response3.getRecord($$client);
			const xxwin1Response3 = await xwin1Response3.contractFunctionResult;
			if (xxwin1Response3) {
				$setWinner3(`0.0.${parseInt(xxwin1Response3.getAddress(0), 16)}`);
			}

			toast('WINNER SUCCESS');
		} catch (error) {
			toast(`WINNER FAILED`, $helper.toString(error));
		}
	};

	useEffect(() => {
		const myPrivateKey: string = PrivateKey.fromString(process.env.NEXT_PUBLIC_TEST_PRIVATE || '').toString();
		const myAccountId: string = AccountId.fromString(process.env.NEXT_PUBLIC_TEST_ACCOUNT || '').toString();
		if (myAccountId && myPrivateKey) {
			$$client.setOperator(myAccountId, myPrivateKey);
			getInitData();
		}

		$setLoading(false);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (pairingData) {
			if (pairingData.accountIds) {
				$setAccountId(pairingData.accountIds.reduce($helper.conCatAccounts).toString());
			}
		}

		// eslint-disable-next-line
	}, [pairingData]);

	return (
		<MainLayout>
			<Head>
				<title>RANDOM GAME | ADMIN</title>
				<meta name="description" content="admin" />
			</Head>

			<main className={styles.main}>
				{$loading ? (
					'loading...'
				) : (
					<Container className="container">
						{$accountId && $accountId === process.env.NEXT_PUBLIC_TEST_ACCOUNT ? (
							<>
								<Grid.Container gap={2}>
									<Grid xs={12} lg={3}>
										<Spacer y={1} />
										<Button className="full_width" size="lg" auto onPress={startGame} disabled={$gameStart}>
											START GAME
										</Button>
									</Grid>
									<Grid xs={12} lg={3}>
										<Spacer y={1} />
										<Button
											className="full_width"
											size="lg"
											auto
											onPress={winGame}
											disabled={$currentPlayers === 0 || $currentPlayers < $numberOfWinners}
										>
											SELECT GAME WINNER
										</Button>
									</Grid>
									<Grid xs={12} lg={6}>
										<Spacer y={1} />
										<Button className="full_width" size="lg" auto onPress={() => getWinner()}>
											CHECK LATEST GAME WINNERS
										</Button>
									</Grid>
								</Grid.Container>
								<Grid.Container gap={2}>
									<Grid xs={12} lg={3}>
										<Spacer y={1} />
										<Input
											aria-label="numberOfPlayers"
											min="1"
											width="100%"
											bordered
											labelPlaceholder="number of players"
											type="number"
											value={$numberOfPlayers}
											onChange={handleChangeNumberOfPlayers}
										/>
									</Grid>
									<Grid xs={12} lg={3}>
										<Spacer y={1} />
										<Input
											aria-label="numberOfWinners"
											min="1"
											max="3"
											width="100%"
											bordered
											labelPlaceholder="number of winners"
											type="number"
											value={$numberOfWinners}
											onChange={handleChangeNumberOfWinners}
										/>
									</Grid>
									<Grid xs={12} lg={6}>
										<Spacer y={1} />
										<Input
											aria-label="winner1"
											width="100%"
											bordered
											labelPlaceholder="winner 1"
											readOnly
											value={$winner1}
										/>
										<Spacer y={1} />
										<Input
											aria-label="winner2"
											width="100%"
											bordered
											labelPlaceholder="winner 2"
											readOnly
											value={$winner2}
										/>
										<Spacer y={1} />
										<Input
											aria-label="winner3"
											width="100%"
											bordered
											labelPlaceholder="winner 3"
											readOnly
											value={$winner3}
										/>
									</Grid>
								</Grid.Container>
								<Grid.Container gap={2}>
									<Grid xs={12} lg={3}>
										<Spacer y={1} />
										<Input
											aria-label="currentPlayers"
											width="100%"
											bordered
											labelPlaceholder="current players"
											readOnly
											type="number"
											value={$currentPlayers}
										/>
									</Grid>
									<Grid xs={12} lg={3}></Grid>
									<Grid xs={12} lg={6}></Grid>
								</Grid.Container>
								<Grid.Container gap={2}>
									<Grid xs={12} lg={3}>
										<Spacer y={1} />
										<Button className="full_width" size="lg" auto onPress={stopGame} disabled={!$gameStart}>
											STOP GAME
										</Button>
									</Grid>
									<Grid xs={12} lg={3}></Grid>
									<Grid xs={12} lg={6}></Grid>
								</Grid.Container>
							</>
						) : (
							''
						)}
					</Container>
				)}
			</main>
		</MainLayout>
	);
};

export default Admin;
