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
import TextField, { TextFieldInput } from 'preact-material-components/TextField';
import EditProfile from '../EditProfile';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/Toolbar/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/TextField/style.css';
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
import { SETTINGS } from '../../enums/settings';
import { disable_beta, enable_beta, enable_waveform, disable_waveform } from '../../actions/settings';
import { SearchModal } from '../SearchModal';

@connect(state => state)
export default class Header extends Component {

	currentUrl = '/';

	openSettings = () => {
		this.closeMenu();
		this.settingsModal.MDComponent.show();
	};

	openEditProfileModal = () => {
		this.closeMenu();
		this.editProfileModal.MDComponent.show();
	};

	openGotoPanel = () => {
		this.closeMenu();
		this.gotoPanel.MDComponent.show();
	};

	closeGoToPanel = () => {
		this.gotoPanel.MDComponent.close();
		this.props.dispatch({ type: "HIDE_GOTO_PANEL" });
	};

	closeProfilePanel = () => {
		this.editProfileModal.MDComponent.close();
	}

	showUploadTrackModal = () => {
		this.closeMenu();
		this.uploadTrackModal.MDComponent.show();
	};

	openShortcutsPanel = () => {
		this.closeMenu();
		this.shortcutsPanel.MDComponent.show();
	};

	closeShortcutsPanel = () => {
		this.shortcutsPanel.MDComponent.close();
		this.props.dispatch({ type: "HIDE_SHORTCUTS_PANEL" });
	};

	openShareTrackModal = (track) => {
		this.setState({ shareTrack: track });
		this.shareTrackModal.MDComponent.show();
	};

	settingsDialogRef = dialog => (this.settingsModal = dialog);
	editProfileDialogRef = dialog => (this.editProfileModal = dialog);
	editProfileRef = editProfile => (this.editProfile = editProfile);
	gotoPanelRef = gotoPanel => (this.gotoPanel = gotoPanel);
	uploadTrackModalRef = dialog => (this.uploadTrackModal = dialog);
	shortcutsPanelRef = dialog => (this.shortcutsPanel = dialog);
	shareTrackModalRef = dialog => (this.shareTrackModal = dialog);

	linkTo = path => () => {
		if (this.closeMenu) this.closeMenu();
		raf(_ => {
			this.setState({ currentUrl: path });
			route(path, false);
		});
	};

	goHome = e => {
		e.preventDefault();
		this.linkTo('/');
	};

	goToPrivacy = e => {
		e.preventDefault();
		this.linkTo('/privacy-policy');
	}

	goToTermsOfUse = e => {
		e.preventDefault();
		this.linkTo('/terms-of-use');
	}

	goToMyProfile = e => {
		e.preventDefault();
		this.linkTo(`/${this.props.user.profile.url}`);
	};

	goToTrackCollection = e => {
		e.preventDefault();
		this.linkTo(`/collection/tracks`);
	};

	goToArtists = e => {
		e.preventDefault();
		this.linkTo(`${this.props.user.profile.url}/following`);
	}

	goToLogin = e => {
		e.preventDefault();
		this.linkTo('/login');
	};

	goToRegister = e => {
		e.preventDefault();
		this.linkTo('/register');
	};

	goToStats = e => {
		e.preventDefault();
		this.linkTo('/you/stats');
	};

	goToAdmin = e => {
		e.preventDefault();
		this.linkTo('/admin');
	}

	toggleDarkTheme = () => {
		if (this.props.UI.theme === THEMES.dark) {
			light_theme(this.props.dispatch);
		} else {
			dark_theme(this.props.dispatch);
		}
	}

	toggleBeta = () => {
		if (this.props.settings.beta === SETTINGS.ENABLE_BETA) {
			disable_beta(this.props.dispatch);
		} else {
			enable_beta(this.props.dispatch);
		}
	};

	toggleWaveForms = () => {
		if (this.props.settings.waveforms === SETTINGS.DISABLE_WAVEFORMS) {
			enable_waveform(this.props.dispatch);
		} else {
			disable_waveform(this.props.dispatch);
		}
	};

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

	toggleNotificationsMenu = () => {
		const currentState = this.notificationsMenu.MDComponent.open;
		let nextState = true;
		if (null != currentState) nextState = !currentState;
		this.notificationsMenu.MDComponent.open = nextState;
	};

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
		const { auth, user, settings } = this.props;
		let defaultVal = (
			<div>
				<Drawer.DrawerItem onClick={this.goToLogin} class={this.isActive('/login')} href="/login">
					<span class="text">
						<List.ItemGraphic>vpn_key</List.ItemGraphic>
						Login
					</span>
				</Drawer.DrawerItem>
				<Drawer.DrawerItem onClick={this.goToRegister} class={this.isActive('/register')} href="/register">
					<span class="text">
						<List.ItemGraphic>person_add</List.ItemGraphic>
						Register
					</span>
				</Drawer.DrawerItem>
			</div>
		);

		if (auth.logged_in) {
			defaultVal = (
				<div>
					<Drawer.DrawerItem onClick={this.goToMyProfile} class={this.isActive(`/${user.profile.url}`)} href={`/${user.profile.url}`}>
						<span class="text">
							<List.ItemGraphic>account_circle</List.ItemGraphic>
							Profile
						</span>
					</Drawer.DrawerItem>
					<div class="section">
						<h1 class={style['subtitle-header']}>
							My Music
							<small>{settings.beta === SETTINGS.ENABLE_BETA ? "BETA" : "Soon"}</small>
						</h1>
						{settings.beta === SETTINGS.ENABLE_BETA && (
							<Drawer.DrawerItem onClick={this.goToArtists} class={`mdc-list-item ${this.isActive(`/${user.profile.url}/following`)}`} href={`/${user.profile.url}/following`}>
								<span class="text">
									<List.ItemGraphic>person</List.ItemGraphic>
									Artists
								</span>
							</Drawer.DrawerItem>
						)}
						{settings.beta === SETTINGS.ENABLE_BETA && (
							<Drawer.DrawerItem onClick={this.goToTrackCollection} class={`mdc-list-item ${this.isActive(`/collection/tracks`)}`} href='/collection/tracks'>
								<span class="text">
									<List.ItemGraphic>music_note</List.ItemGraphic>
									Songs
								</span>
							</Drawer.DrawerItem>
						)}

						{settings.beta === SETTINGS.DISABLE_BETA && (
							<Drawer.DrawerItem class={`mdc-list-item`}>
								<span class="text">
									<List.ItemGraphic>person</List.ItemGraphic>
									Artists
								</span>
							</Drawer.DrawerItem>
						)}

						{settings.beta === SETTINGS.DISABLE_BETA && (
							<Drawer.DrawerItem class={`mdc-list-item`}>
								<span class="text">
									<List.ItemGraphic>music_note</List.ItemGraphic>
									Songs
								</span>
							</Drawer.DrawerItem>
						)}

						<Drawer.DrawerItem onClick={e => console.log(e)} class={this.isActive(`/${user.profile.url}/playlists`)}>
							<span class="text">
								<List.ItemGraphic>playlist_play</List.ItemGraphic>
								Playlists
							</span>
						</Drawer.DrawerItem>
					</div>

					<div class="section">
						<h1 class={style['subtitle-header']}>
							Artist Panel
						</h1>
						<Drawer.DrawerItem onClick={this.goToStats} class={this.isActive(`/you/stats`)} href="/you/stats">
							<span class="text">
								<List.ItemGraphic>equalizer</List.ItemGraphic>
								Your stats
							</span>
						</Drawer.DrawerItem>
					</div>


					{user.role != null && user.role === "admin" && (
						<div class="section">
							<h1 class={style['subtitle-header']}>
								Administration
							</h1>
							<Drawer.DrawerItem onClick={this.goToAdmin} class={this.isActive(`/admin`)} href="/admin">
								<span class="text">
									<List.ItemGraphic>supervisor_account</List.ItemGraphic>
									Users
								</span>
							</Drawer.DrawerItem>
						</div>
					)}
					<Drawer.DrawerItem onClick={this.logout.bind(this)} class={`align-end ${this.isActive('/logout')}`}>
						<span class="text">
							<List.ItemGraphic>vpn_key</List.ItemGraphic>
							Logout
						</span>
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

	openShareTrack = (track) => {
		this.openShareTrackModal(track);
	}

	componentDidMount () {
		window.document.addEventListener('url-change', () => {
			this.setState({ shareTrack: this.state.shareTrack });
		});
	}

	render ({ auth, user, UI, settings }, { shareTrack }) {
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
								{auth.logged_in === true && settings.beta === SETTINGS.ENABLE_BETA && (
									<div>
										<Toolbar.Icon style={{ marginRight: 10 }} onClick={this.toggleNotificationsMenu}>notifications</Toolbar.Icon>
										<Menu.Anchor>
											<Menu ref={menu => (this.notificationsMenu = menu)} class={style.notificationsMenu}>
												<Menu.Item>
													You have no notifications!
												</Menu.Item>
											</Menu>
										</Menu.Anchor>
									</div>
								)}
								{auth.logged_in === true && (
									<div>
										<Toolbar.Icon onClick={this.showUploadTrackModal}>cloud_upload</Toolbar.Icon>
									</div>
								)}
								<div class={style.header}>
									{auth.logged_in === true && (
										<div>
											<div onClick={this.toggleDropdownMenu.bind(this)} class={style.clickable}>
												<UserPictureName user={user.profile} showUsername={false} />
											</div>
											<Menu.Anchor>
												<Menu ref={menu => { this.menu = menu; }} class={style.menu}>
													<div class={style.userDetails}>
														<UserPictureName user={user.profile} />
													</div>
													<Menu.Item onClick={e => route(`/${this.props.user.profile.url}`, false)}>
														<Icon class={style.icon}>person</Icon>
														Profile
													</Menu.Item>
													<Menu.Item onClick={this.openEditProfileModal}>
														<Icon class={style.icon}>edit</Icon>
														Edit Profile
													</Menu.Item>
													<Menu.Item onClick={this.toggleDarkTheme}>
													<Icon class={style.icon}>brightness_2</Icon>
														{this.props.UI.theme === THEMES.dark ? "Disable" : "Enable"} dark theme
													</Menu.Item>
													<hr class={style.hr} />
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
							<div class="section">
								<h1 class={style['subtitle-header']}>
									Discover
								</h1>
							</div>
							<Drawer.DrawerItem onClick={this.goHome} class={this.isActive('/')} href={`/`}>
								<span class="text">
									<List.ItemGraphic>music_note</List.ItemGraphic>
									Stream
								</span>
							</Drawer.DrawerItem>
							
							{this.login_or_logout()}


							<div class="section">
								<h1 class={style['subtitle-header']}>
									Legal
								</h1>
							</div>
							<Drawer.DrawerItem onClick={this.goToPrivacy} class={this.isActive('/privacy-policy')} href={`/privacy-policy`}>
								<span class="text legal-nav-link">
									<List.ItemGraphic>remove_red_eye</List.ItemGraphic>
									Privacy Policy
								</span>
							</Drawer.DrawerItem>

							<Drawer.DrawerItem onClick={this.goToTermsOfUse} class={this.isActive('/terms-of-use')} href={`/terms-of-use`}>
								<span class="text legal-nav-link">
									<List.ItemGraphic>account_balance</List.ItemGraphic>
									Terms of Use
								</span>
							</Drawer.DrawerItem>
						</Drawer.DrawerContent>
					</Drawer.PermanentDrawer>
					
					{/* TODO: Move these into their own components */}
					<Dialog ref={this.settingsDialogRef} onCancel={e => this.props.dispatch({ type: "HIDE_SETTINGS_PANEL" } )}>
						<div class="modal-border-top"></div>
						<Dialog.Header>Settings</Dialog.Header>
						<Dialog.Body>
							<div class={style.switchContainer}>
								<Switch checked={this.props.UI.theme === THEMES.dark} onClick={this.toggleDarkTheme} id="toggleDarkTheme" />
								<label for="toggleDarkTheme">
									Enable dark theme
								</label>
							</div>
							<div class={style.switchContainer}>
								<Switch checked={settings.beta === SETTINGS.ENABLE_BETA} onClick={this.toggleBeta} id="toggleBetaFeatures" />
								<label for="toggleBetaFeatures">
									Enable beta features
								</label>
							</div>
							{settings.beta === SETTINGS.ENABLE_BETA && (
								<div class={style.switchContainer}>
									<Switch checked={settings.waveforms === SETTINGS.ENABLE_WAVEFORMS || settings.waveforms == null} onClick={this.toggleWaveForms} id="toggleWaveForms" />
									<label for="toggleWaveForms">
										Enable waveforms on profile page (slow)
									</label>
								</div>
							)}
						</Dialog.Body>
					</Dialog>

					<Dialog ref={this.editProfileDialogRef} class="edit-modal">
						<div class="modal-border-top"></div>
						<Dialog.Header>
							Edit Profile
							<Icon class={style.modalClose} onClick={this.closeProfilePanel}>close</Icon>
						</Dialog.Header>
						<Dialog.Body>
							<EditProfile ref={this.editProfileRef} onSubmit={this.closeProfilePanel} />
						</Dialog.Body>
					</Dialog>

					<Dialog ref={this.gotoPanelRef} onCancel={e => this.closeGoToPanel()}>
						<div class="modal-border-top"></div>
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
						<div class="modal-border-top"></div>
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
						<div class="modal-border-top"></div>
						<Dialog.Header>Upload track</Dialog.Header>
						<Dialog.Body>
							<UploadTrack />
						</Dialog.Body>
					</Dialog>

					<Dialog ref={this.shareTrackModalRef}>
						<div class="modal-border-top"></div>
						<Dialog.Header>Share track</Dialog.Header>
						<Dialog.Body>
							{shareTrack != null && shareTrack != '' && (
								<div>
									<div className={style.trackDetails}>
										<img src={shareTrack.artwork} />
										<p title={`${(shareTrack.user.displayName || shareTrack.user.firstName || shareTrack.user.id)} - ${shareTrack.name}`}>
											{(shareTrack.user.displayName || shareTrack.user.firstName || shareTrack.user.id)} - {shareTrack.name}
										</p>
									</div>
									<TextField
										readonly="readonly"
										value={`${location.origin}/${shareTrack.user.url}/${shareTrack.url}${shareTrack.visibility === 'private' ? `?secret=${shareTrack.secret_key}`: ''}`}
										className={style.inputContainer}
									/>
								</div>
							)}
						</Dialog.Body>
					</Dialog>

					<SearchModal />

					<div class="mdc-toolbar-blur-bg"></div>
				</div>
			);
		}
	}
}
