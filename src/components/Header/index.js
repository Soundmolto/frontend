import { h, Component } from 'preact';
import { route } from 'preact-router';
import { connect } from 'preact-redux';
import { logout } from '../../actions/logout';
import Toolbar from 'preact-material-components/Toolbar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';
import Dialog from 'preact-material-components/Dialog';
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Toolbar/style.css';
import { dark_theme, light_theme } from '../../actions/ui';
import { THEMES } from '../../themes';

@connect(state => state)
export default class Header extends Component {
	closeDrawer() {
		this.drawer.MDComponent.open = false;
	}

	openDrawer = () => (this.drawer.MDComponent.open = true);

	openSettings = () => this.dialog.MDComponent.show();

	drawerRef = drawer => (this.drawer = drawer);
	dialogRef = dialog => (this.dialog = dialog);

	linkTo = path => () => {
		route(path);
		this.closeDrawer();
	};

	goHome = this.linkTo('/');
	goToMyProfile = this.linkTo('/profile');
	goToLogin = this.linkTo('/login');

	toggleDarkTheme = () => {
		if (this.props.UI.theme === THEMES.dark) {
			light_theme(this.props.dispatch);
		} else {
			dark_theme(this.props.dispatch);
		}
	}

	logout () {
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

	render ({ auth, user }) {
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
						<Toolbar.Section align-end={true} onClick={this.openSettings}>
							<Toolbar.Icon>settings</Toolbar.Icon>
						</Toolbar.Section>
					</Toolbar.Row>
				</Toolbar>
				<Drawer.TemporaryDrawer ref={this.drawerRef}>
					<Drawer.DrawerHeader>
						Welcome {user.profile.displayName || ""}
					</Drawer.DrawerHeader>
					<Drawer.DrawerContent>
						<Drawer.DrawerItem onClick={this.goHome}>
							<List.ItemGraphic>home</List.ItemGraphic>
							Home
						</Drawer.DrawerItem>
						
						{this.login_or_logout()}
					</Drawer.DrawerContent>
				</Drawer.TemporaryDrawer>
				<Dialog ref={this.dialogRef}>
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
			</div>
		);
	}
}
