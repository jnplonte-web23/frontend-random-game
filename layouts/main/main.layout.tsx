import * as PropTypes from 'prop-types';
import type { Web3Provider } from '@ethersproject/providers';
import type { IProps } from '../../interfaces';

import { useWeb3React } from '@web3-react/core';

import { CustomNavbar, CustomFooter } from './../components';

const MainLayout = (props: IProps) => {
	const { children } = props;
	const { account } = useWeb3React<Web3Provider>();

	return (
		<>
			<CustomNavbar className="navbar_container" account={account?.toString()} />
			<div className="main_container">{children}</div>
			<CustomFooter className="footer_container" />
		</>
	);
};

MainLayout.propTypes = {
	children: PropTypes.node,
};

export default MainLayout;
