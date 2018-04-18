import { Component } from "preact";
import Tabs from 'preact-material-components/Tabs';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/Tabs/style.css';
import 'preact-material-components/Icon/style.css';

export default class Footer extends Component {
    render () {
        return (
            <div className="footer">
                <Tabs className="demo-tabs" icon-tab-bar={true}>
                    <Tabs.Tab>
                        <Icon>favorite</Icon>
                    </Tabs.Tab>
                    <Tabs.Tab>
                        <Icon>done</Icon>
                    </Tabs.Tab>
                    <Tabs.Tab>
                        <Icon>info</Icon>
                    </Tabs.Tab>
                </Tabs>
            </div>
        );
    }
}