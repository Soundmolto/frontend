import { h, Component } from 'preact';
import { route } from 'preact-router';
import { connect } from 'preact-redux';
import Toolbar from 'preact-material-components/Toolbar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';
import Dialog from 'preact-material-components/Dialog';
import Switch from 'preact-material-components/Switch';
import Menu from 'preact-material-components/Menu';
import Icon from 'preact-material-components/Icon';
import EditProfile from '../EditProfile';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Toolbar/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Menu/style.css';
import { UserPictureName } from '../UserPictureName';
import style from './style';

import { THEMES } from '../../enums/themes';
import { dark_theme, light_theme } from '../../actions/ui';
import { logout } from '../../actions/logout';

@connect(state => state)
export default class Header extends Component {

	closeDrawer() {
		this.drawer.MDComponent.open = false;
	}

	openDrawer = () => (this.drawer.MDComponent.open = true);

	openSettings = () => this.settingsModal.MDComponent.show();
	openEditProfileModal = () => this.editProfileModal.MDComponent.show();

	drawerRef = drawer => (this.drawer = drawer);
	settingsDialogRef = dialog => (this.settingsModal = dialog);
	editProfileDialogRef = dialog => (this.editProfileModal = dialog);
	editProfileRef = editProfile => (this.editProfile = editProfile);

	linkTo = path => () => {
		route(path);
		this.closeDrawer();
	};

	goHome = this.linkTo('/');
	goToMyProfile = this.linkTo('/me');
	goToLogin = this.linkTo('/login');

	toggleDarkTheme = () => {
		if (this.props.UI.theme === THEMES.dark) {
			light_theme(this.props.dispatch);
		} else {
			dark_theme(this.props.dispatch);
		}
	}

	toggleMenu () {
		const currentState = this.menu.MDComponent.open;
		let nextState = true;
		if (null != currentState) nextState = !currentState;
		this.menu.MDComponent.open = nextState;
	}

	logout () {
		this.closeDrawer();
		this.props.dispatch(logout());
	}

	login_or_logout () {
		let defaultVal = (
			<Drawer.DrawerItem onClick={this.goToLogin}>
				<List.ItemGraphic>vpn_key</List.ItemGraphic>
				Login
			</Drawer.DrawerItem>
		);

		if (this.props.auth.logged_in) {
			defaultVal = (
				<div>
					<Drawer.DrawerItem onClick={this.goToMyProfile}>
						<List.ItemGraphic>account_circle</List.ItemGraphic>
						Profile
					</Drawer.DrawerItem>
					<Drawer.DrawerItem onClick={this.logout.bind(this)}>
						<List.ItemGraphic>vpn_key</List.ItemGraphic>
						Logout
					</Drawer.DrawerItem>
				</div>
			);
		}

		return defaultVal;
	}

	render ({ auth, user, UI }) {
		try {
			if (UI.settings_open === true) {
				this.openSettings();
			}
		} catch (e) {
			console.log(e);
		} finally {
			return (
				<div>
					<Toolbar className="toolbar">
						<Toolbar.Row>
							<Toolbar.Section align-start>
								<Toolbar.Icon menu onClick={this.openDrawer}>
									menu
								</Toolbar.Icon>
								<Toolbar.Title>
									Music streaming app
								</Toolbar.Title>
							</Toolbar.Section>
							<Toolbar.Section align-end={true} >
								<div class={style.header}>
									{auth.logged_in === true && (
										<div>
											<div onClick={this.toggleMenu.bind(this)} class={style.clickable}>
												<UserPictureName user={user} />
											</div>
											<Menu.Anchor>
												<Menu ref={menu => { this.menu = menu; }} class={style.menu}>
													<p class={style.padding}>
														{user.profile.displayName || user.profile.url || ""}
													</p>
													<Menu.Item onClick={this.goToMyProfile}>
														<Icon class={style.icon}>person</Icon>
														Profile
													</Menu.Item>
													<Menu.Item onClick={this.openEditProfileModal}>
														<Icon class={style.icon}>edit</Icon>
														Edit Profile
													</Menu.Item>
													<Menu.Item onClick={this.logout.bind(this)}>
														<Icon class={style.icon}>vpn_key</Icon>
														Logout
													</Menu.Item>
												</Menu>
											</Menu.Anchor>
										</div>
									)}
								</div>
								<div>
									<Toolbar.Icon onClick={this.openSettings}>settings</Toolbar.Icon>
								</div>
							</Toolbar.Section>
						</Toolbar.Row>
					</Toolbar>
					<Drawer.TemporaryDrawer ref={this.drawerRef}>
						<Drawer.DrawerHeader>
							Welcome {user.profile.displayName || user.profile.url || ""}
						</Drawer.DrawerHeader>
						<Drawer.DrawerContent>
							<Drawer.DrawerItem onClick={this.goHome}>
								<List.ItemGraphic>home</List.ItemGraphic>
								Home
							</Drawer.DrawerItem>
							
							{this.login_or_logout()}
						</Drawer.DrawerContent>
					</Drawer.TemporaryDrawer>
					<Dialog ref={this.settingsDialogRef} onCancel={e => this.props.dispatch({ type: "HIDE_SETTINGS_PANEL" } )}>
						<Dialog.Header>Settings</Dialog.Header>
						<Dialog.Body>
							<div>
								Enable dark theme <Switch checked={this.props.UI.theme === THEMES.dark} onClick={this.toggleDarkTheme} />
							</div>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.FooterButton accept>okay</Dialog.FooterButton>
						</Dialog.Footer>
					</Dialog>
					<Dialog ref={this.editProfileDialogRef}>
						<Dialog.Header>Edit Profile</Dialog.Header>
						<Dialog.Body>
							<EditProfile ref={this.editProfileRef} />
						</Dialog.Body>
					</Dialog>
				</div>
			);
		}
	}
}
