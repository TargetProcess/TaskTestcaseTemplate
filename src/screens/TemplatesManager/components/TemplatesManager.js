var React = require('react');
var TemplatesManagerRow = require('./TemplatesManagerRow');

import defaultStore from 'stores/templatesStore';

// TODO: switch to create-mashup-app because webpack 1 doesn't work with lodash-es and new componenets in package
class PlusIcon extends React.Component {
    render() {
        return (
            <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" style={{display: 'block'}}>
                <path
                    d="M8 2C7.44775 2 7 2.44772 7 3V7H3C2.44775 7 2 7.44772 2 8C2 8.55228 2.44775 9 3 9H7V13C7 13.5523 7.44775 14 8 14C8.55225 14 9 13.5523 9 13V9H13C13.5522 9 14 8.55228 14 8C14 7.44772 13.5522 7 13 7H9V3C9 2.44772 8.55225 2 8 2Z"
                    fill="#60A554"
                />
            </svg>
        )
    }
}

var TemplatesManager = React.createClass({
    getDefaultProps() {
        return {
            disabled: false,
            store: defaultStore
        };
    },

    componentDidMount() {
        defaultStore.entity = this.props.entity;
        defaultStore.configurator = this.props.configurator;

        this.updateHandler = function() {
            this.forceUpdate();
        }.bind(this);

        this.props.store.on('update', this.updateHandler);

        if (!this.disabled) {
            this.props.store.read();
        }
    },

    componentWillUnmount() {
        this.props.store.removeListener('update', this.updateHandler);
    },

    render() {
        const {disabled, store} = this.props;
        if (disabled) {
            return null;
        }

        return (
            <div className="templates-mashap">
                <div className="tm-add-btn" onClick={this.handleCreateTemplate}>
                    <PlusIcon color="#60A554" />
                    <span className="tm-add-btn__text">{'Add template'}</span>
                </div>
                <table className="tm-grid">
                    {store.items.map((v) => <TemplatesManagerRow item={v} key={v.key} store={store} />)}
                </table>
            </div>
        );
    },

    handleCreateTemplate() {
        this.props.store.createTemplate();
    }
});

module.exports = TemplatesManager;
