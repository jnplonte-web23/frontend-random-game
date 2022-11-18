import * as PropTypes from 'prop-types';
import type { IProps } from '../../../interfaces';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Navbar, Dropdown, Link, Text, Avatar, Modal, Button, Grid } from '@nextui-org/react';

import { Helper } from '../../../services/helper/helper.service';

import useHashpack from '../../../hooks/useHashpack.hook';
import { GetHashPackInformation } from '../../../providers/hashpack.provider';

const CustomNavbar = (props: IProps) => {
	const { className } = props;

	const { pairingString, pairingData, state, topic, network, hashconnect } = GetHashPackInformation();
	const { connectToExtension, disconnect } = useHashpack();

	const $helper: Helper = useMemo(() => new Helper(), []);

	const $router = useRouter();

	const [$visible, $setVisible] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(pairingString!);
	};

	const handleClick = () => {
		if (!pairingData) {
			connectToExtension();
		} else if (pairingData) {
			disconnect();
		} else {
			alert('Please install hashpack wallet extension first. from chrome web store.');
		}
	};

	const checkIfActive = useCallback(
		(_route: string): boolean => {
			return $router.pathname === `/${_route}`;
		},
		[$router]
	);

	const showSignInModal = useCallback((): void => $setVisible(true), [$setVisible]);
	const hideSignInModal = useCallback((): void => $setVisible(false), [$setVisible]);

	return (
		<>
			<Modal closeButton preventClose aria-labelledby="SIGN IN" open={$visible} onClose={hideSignInModal}>
				<Modal.Header>
					<Text id="sign-in-title" size={18}>
						SIGN IN
					</Text>
				</Modal.Header>
				<Modal.Body>
					<Grid.Container gap={2} justify="center">
						<Grid md={8}>
							<p>{pairingString?.substring(0, 25)}...</p>
						</Grid>
						<Grid md={4}>
							<Button className="full_width" onPress={handleCopy} auto>
								Copy
							</Button>
						</Grid>
						<Grid md={12}>
							<Button size="md" color="primary" className="full_width" auto onPress={handleClick}>
								SIGN IN USING HASHPACK
							</Button>
						</Grid>
					</Grid.Container>
				</Modal.Body>
			</Modal>
			<Navbar isBordered={true} variant="sticky" maxWidth="fluid" className={className}>
				<Navbar.Content>
					<Navbar.Toggle showIn="xs" />
					<Navbar.Brand>
						<Link color="inherit" href="/">
							<span className="no_break">WEB23</span>
						</Link>
					</Navbar.Brand>
					<Navbar.Content activeColor="primary" hideIn="xs" variant="underline">
						<Navbar.Link key="desktopGame" isActive={checkIfActive('game')} href="/game">
							<span className="no_break">GAME</span>
						</Navbar.Link>
					</Navbar.Content>
					<Navbar.Collapse>
						<Navbar.CollapseItem key="desktopGame" activeColor="primary" isActive={checkIfActive('game')}>
							<Link href="/game">
								<span className="no_break">GAME</span>
							</Link>
						</Navbar.CollapseItem>
					</Navbar.Collapse>
				</Navbar.Content>

				{!pairingData ? (
					<Navbar.Content>
						<Button rounded color="primary" auto onPress={showSignInModal}>
							SIGN IN
						</Button>
					</Navbar.Content>
				) : (
					<Navbar.Content>
						<Dropdown placement="bottom-right">
							<Navbar.Item>
								<Dropdown.Trigger>
									<Button auto color="primary" rounded>
										USER
									</Button>
								</Dropdown.Trigger>
							</Navbar.Item>
							<Dropdown.Menu color="primary">
								<Dropdown.Item textValue="profile" key="profile" css={{ height: '$18' }}>
									<Text color="inherit">
										{pairingData?.accountIds && pairingData?.accountIds.reduce($helper.conCatAccounts)}
									</Text>
								</Dropdown.Item>
								<Dropdown.Item textValue="logout" key="logout" withDivider color="error">
									<Button light onPress={handleClick}>
										LOGOUT
									</Button>
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Navbar.Content>
				)}
			</Navbar>
		</>
	);
};

CustomNavbar.propTypes = {
	className: PropTypes.string,
};

export default CustomNavbar;
