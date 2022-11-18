import { MessageTypes } from 'hashconnect';

import { GetHashPackInformation } from '../providers/hashpack.provider';

const useHashpack = () => {
	const { hashconnect, topic, pairingData, network, setState } = GetHashPackInformation();

	const connectToExtension = async () => {
		hashconnect.connectToLocalWallet();
	};

	const sendTransaction = async (
		trans: Uint8Array,
		acctToSign: string,
		return_trans: boolean = false,
		hideNfts: boolean = false
	) => {
		const transaction: MessageTypes.Transaction = {
			topic: topic!,
			byteArray: trans,

			metadata: {
				accountToSign: acctToSign,
				returnTransaction: return_trans,
				hideNft: hideNfts,
			},
		};

		return await hashconnect.sendTransaction(topic!, transaction);
	};

	const disconnect = () => {
		hashconnect.disconnect(pairingData?.topic!);
		setState!((exState) => ({ ...exState, pairingData: null }))!;
	};

	const requestAccountInfo = async () => {
		const request: MessageTypes.AdditionalAccountRequest = {
			topic: topic!,
			network: network!,
			multiAccount: true,
		};

		await hashconnect.requestAdditionalAccounts(topic!, request);
	};

	const clearPairings = () => {
		hashconnect.clearConnectionsAndData();
		setState!((exState) => ({ ...exState, pairingData: null }));
	};

	return { connectToExtension, sendTransaction, disconnect, requestAccountInfo, clearPairings };
};

export default useHashpack;
