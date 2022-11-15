import * as PropTypes from 'prop-types';
import type { IProps } from '../../../interfaces';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Navbar, Dropdown, Link, Text, Avatar, Modal, Button, Grid } from '@nextui-org/react';

import useStorage from '../../../hooks/useStorage.hook';

import { Helper } from '../../../services/helper/helper.service';

const CustomNavbar = (props: IProps) => {
	const { className, account } = props;

	const $helper: Helper = useMemo(() => new Helper(), []);

	const $router = useRouter();
	const { getItem } = useStorage();

	const [$visible, $setVisible] = useState(false);
	const [$loginType, $setLoginType] = useState('');

	const checkIfActive = useCallback(
		(_route: string): boolean => {
			return $router.pathname === `/${_route}`;
		},
		[$router]
	);

	const showSignInModal = useCallback((): void => $setVisible(true), [$setVisible]);
	const hideSignInModal = useCallback((): void => $setVisible(false), [$setVisible]);

	useEffect(() => {
		const isHasPack: string | null = getItem('isHasPackLogIn');
		if (isHasPack) {
			$setLoginType('HASHPACK');
		}
		// eslint-disable-next-line
	}, []);

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
						<Grid md={12}>
							<Button
								size="md"
								color="primary"
								className="full_width"
								auto
								onClick={() => console.log('haspack login here')}
							>
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
							<Text b>WEB23</Text>
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

				{!account ? (
					<Navbar.Content>
						<Button size="sm" color="primary" auto onClick={showSignInModal}>
							SIGN IN
						</Button>
					</Navbar.Content>
				) : (
					<Navbar.Content>
						<Dropdown placement="bottom-right">
							<Navbar.Item>
								<Dropdown.Trigger>
									<Avatar bordered as="button" color="primary" src="/dog.png" />
								</Dropdown.Trigger>
							</Navbar.Item>
							<Dropdown.Menu color="primary">
								<Dropdown.Item textValue="profile" key="profile" css={{ height: '$18' }}>
									<Text color="inherit">{$loginType} ACCOUNT</Text>
									<Text color="inherit">{$helper.shorthenAddress(account)}</Text>
								</Dropdown.Item>
								<Dropdown.Item textValue="logout" key="logout" withDivider color="error">
									LOG OUT
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
	account: PropTypes.string,
};

export default CustomNavbar;
