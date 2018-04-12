import { Provider, connect } from 'preact-redux';
import App from './components/App';
import store from './store';
import './style';

console.log(store);

const Main = () => (
	<Provider store={store}>
		<App />
	</Provider>
);


export default Main;
