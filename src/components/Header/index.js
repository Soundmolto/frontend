import { h, Component } from 'preact';
import { route, Link, getCurrentUrl } from 'preact-router';
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
import 'preact-material-components/Toolbar/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Menu/style.css';
import { UserPictureName } from '../UserPictureName';
import { shortcuts } from '../../shortcuts';
import style from './style';

import { THEMES } from '../../enums/themes';
import { dark_theme, light_theme } from '../../actions/ui';
import { logout } from '../../actions/logout';
import { UploadTrack } from '../UploadTrack';
import { APP } from '../../enums/app';
import { Search } from '../Search';
import raf from 'raf';

@connect(state => state)
export default class Header extends Component {

	currentUrl = '/';

	openSettings = () => this.settingsModal.MDComponent.show();
	openEditProfileModal = () => this.editProfileModal.MDComponent.show();
	openGotoPanel = () => this.gotoPanel.MDComponent.show();
	closeGoToPanel = () => { this.gotoPanel.MDComponent.close(); this.props.dispatch({ type: "HIDE_GOTO_PANEL" }); };
	showUploadTrackModal = () => { this.uploadTrackModal.MDComponent.show(); };
	openShortcutsPanel = () => this.shortcutsPanel.MDComponent.show();
	closeShortcutsPanel = () => { this.shortcutsPanel.MDComponent.close(); this.props.dispatch({ type: "HIDE_SHORTCUTS_PANEL" }); };

	settingsDialogRef = dialog => (this.settingsModal = dialog);
	editProfileDialogRef = dialog => (this.editProfileModal = dialog);
	editProfileRef = editProfile => (this.editProfile = editProfile);
	gotoPanelRef = gotoPanel => (this.gotoPanel = gotoPanel);
	uploadTrackModalRef = dialog => (this.uploadTrackModal = dialog);
	shortcutsPanelRef = dialog => (this.shortcutsPanel = dialog);

	linkTo = path => () => {
		if (this.closeMenu) this.closeMenu();
		raf(_ => {
			this.setState({ currentUrl: path });
			route(path, false);
		});
	};

	goHome = this.linkTo('/');
	goToMyProfile = this.linkTo(`/${this.props.user.profile.url}`);
	goToLogin = this.linkTo('/login');
	goToRegister = this.linkTo('/register');

	toggleDarkTheme = () => {
		if (this.props.UI.theme === THEMES.dark) {
			light_theme(this.props.dispatch);
		} else {
			dark_theme(this.props.dispatch);
		}
	}

	toggleMenu () {
		if (typeof window !== "undefined") {
			window.document.querySelector(`.${style.drawerCloseContainer}`).classList.toggle(style.visible);
			window.document.querySelector('.mdc-drawer--permanent').classList.toggle('open');
		}
	}

	toggleDropdownMenu () {
		const currentState = this.menu.MDComponent.open;
		let nextState = true;
		if (null != currentState) nextState = !currentState;
		this.menu.MDComponent.open = nextState;
	}

	closeMenu () {
		if (typeof window !== "undefined") {
			const closeContainer = window.document.querySelector(`.${style.drawerCloseContainer}`);
			const drawer = window.document.querySelector('.mdc-drawer--permanent');
			if (closeContainer) closeContainer.classList.remove(style.visible);
			if (drawer) drawer.classList.remove('open');
		}
	}

	logout () {
		this.props.dispatch(logout());
	}

	login_or_logout () {
		const { auth, user } = this.props;
		let defaultVal = (
			<div>
				<Drawer.DrawerItem onClick={this.goToLogin} class={this.isActive('/login')} href="/login">
					<List.ItemGraphic>vpn_key</List.ItemGraphic>
					Login
				</Drawer.DrawerItem>
				<Drawer.DrawerItem onClick={this.goToRegister} class={this.isActive('/register')} href="/register">
					<List.ItemGraphic>person_add</List.ItemGraphic>
					Register
				</Drawer.DrawerItem>
			</div>
		);

		if (auth.logged_in) {
			defaultVal = (
				<div>
					<Drawer.DrawerItem onClick={this.goToMyProfile} class={this.isActive(`/${user.profile.url}`)} href={`/${user.profile.url}`}>
						<List.ItemGraphic>account_circle</List.ItemGraphic>
						Profile
					</Drawer.DrawerItem>
					<div class="section">
						<h1 class={style['subtitle-header']}>
							My Music
							<small>Coming soon</small>
						</h1>
						<Drawer.DrawerItem onClick={e => console.log(e)} class={this.isActive(`/${user.profile.url}/artists`)}>
							<List.ItemGraphic>person</List.ItemGraphic>
							Artists
						</Drawer.DrawerItem>
						<Drawer.DrawerItem onClick={e => console.log(e)} class={this.isActive(`/${user.profile.url}/songs`)}>
							<List.ItemGraphic>music_note</List.ItemGraphic>
							Songs
						</Drawer.DrawerItem>
						<Drawer.DrawerItem onClick={e => console.log(e)} class={this.isActive(`/${user.profile.url}/playlists`)}>
							<List.ItemGraphic>playlist_play</List.ItemGraphic>
							Playlists
						</Drawer.DrawerItem>
					</div>
					{user.role != null && user.role === "admin" && (
						<div class="section">
							<h1 class={style['subtitle-header']}>
								Administration
							</h1>
							<Drawer.DrawerItem onClick={this.goToAdmin} class={this.isActive(`/admin`)} href="/admin">
								<List.ItemGraphic>supervisor_account</List.ItemGraphic>
								Admin panel
							</Drawer.DrawerItem>
						</div>
					)}
					<Drawer.DrawerItem onClick={this.logout.bind(this)} class={`align-end ${this.isActive('/logout')}`}>
						<List.ItemGraphic>vpn_key</List.ItemGraphic>
						Logout
					</Drawer.DrawerItem>
				</div>
			);
		}

		return defaultVal;
	}

	isActive (url) {
		let className = '';
		if (url === getCurrentUrl()) className = 'active';
		return className;
	}

	render ({ auth, user, UI }) {
		this.currentUrl = getCurrentUrl();

		try {
			if (UI.settings_open === true) {
				this.openSettings();
			}

			if (UI.goto_open === true) {
				this.openGotoPanel();
			}

			if (UI.shortcuts_open === true) {
				this.openShortcutsPanel();
			}
		} catch (e) {
			console.log(e);
		} finally {
			return (
				<div>
					<Toolbar className="toolbar">
						<Toolbar.Row>
							<Toolbar.Section align-start>
								<Toolbar.Title>
									<span class={style.appName}>{APP.NAME}</span>
								</Toolbar.Title>
								<span class={style.menuIcon} onClick={this.toggleMenu}>
									<Icon class={style.icon}>menu</Icon>
								</span>
							</Toolbar.Section>
							<Toolbar.Section align-center class={style.hideMobile}>
								<Search token={auth.token} />
							</Toolbar.Section>
							<Toolbar.Section align-end={true} style={{ 'margin-right': '10px' }}>
								{auth.logged_in === true && (
									<div>
										<Toolbar.Icon onClick={this.showUploadTrackModal}>cloud_upload</Toolbar.Icon>
									</div>
								)}
								<div class={style.header}>
									{auth.logged_in === true && (
										<div>
											<div onClick={this.toggleDropdownMenu.bind(this)} class={style.clickable}>
												<UserPictureName user={user.profile} />
											</div>
											<Menu.Anchor>
												<Menu ref={menu => { this.menu = menu; }} class={style.menu}>
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
					<div class={style.drawerCloseContainer} onClick={this.closeMenu}></div>
					<Drawer.PermanentDrawer class={`${style.drawer} ${auth.logged_in !== true && style.loggedOut}`}>
						<Drawer.DrawerContent>
							<Drawer.DrawerItem onClick={this.goHome} class={this.isActive('/')} href={`/`}>
								<List.ItemGraphic>music_note</List.ItemGraphic>
								Discover
							</Drawer.DrawerItem>
							
							{this.login_or_logout()}
						</Drawer.DrawerContent>
					</Drawer.PermanentDrawer>
					<Dialog ref={this.settingsDialogRef} onCancel={e => this.props.dispatch({ type: "HIDE_SETTINGS_PANEL" } )}>
						<Dialog.Header>Settings</Dialog.Header>
						<Dialog.Body>
							<div>
								Enable dark theme <Switch checked={this.props.UI.theme === THEMES.dark} onClick={this.toggleDarkTheme} />
							</div>
						</Dialog.Body>
					</Dialog>

					<Dialog ref={this.editProfileDialogRef}>
						<Dialog.Header>Edit Profile</Dialog.Header>
						<Dialog.Body>
							<EditProfile ref={this.editProfileRef} />
						</Dialog.Body>
					</Dialog>

					<Dialog ref={this.gotoPanelRef} onCancel={e => this.closeGoToPanel()}>
						<Dialog.Header>Go to</Dialog.Header>
						<Dialog.Body class={style["goto-panel"]}>
							<Link href="/" onClick={e => this.closeGoToPanel()}>Home</Link>
							{!auth.logged_in && <Link href="/login" onClick={e => this.closeGoToPanel()}>Login</Link>}
							{!auth.logged_in && <Link href="/register" onClick={e => this.closeGoToPanel()}>Register</Link>}
							<Link href="/users" onClick={e => this.closeGoToPanel()}>Users</Link>
							{auth.logged_in && <Link href="/me" onClick={e => this.closeGoToPanel()}>My profile</Link>}
							{auth.logged_in && <Link href="#" onClick={e => {
								e.preventDefault();
								this.logout();
								this.closeGoToPanel();
							}}>Logout</Link>}
						</Dialog.Body>
					</Dialog>

					<Dialog ref={this.shortcutsPanelRef} onCancel={e => this.closeShortcutsPanel()}>
						<Dialog.Header>Shortcuts</Dialog.Header>
						<Dialog.Body class={style["goto-panel"]}>
							<ul class={style["shortcuts"]}>
								{shortcuts.map(shortcut => (
									<li>
										<pre>{shortcut.keys}</pre>
										<p>{shortcut.description}</p>
									</li>
								))}
							</ul>
						</Dialog.Body>
					</Dialog>

					<Dialog ref={this.uploadTrackModalRef}>
						<Dialog.Header>Upload track</Dialog.Header>
						<Dialog.Body>
							<UploadTrack />
						</Dialog.Body>
					</Dialog>
					<div class="mdc-toolbar-blur-bg"></div>
				</div>
			);
		}
	}
}
