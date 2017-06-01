var React = require('react');
var TemplatesManagerRow = require('./TemplatesManagerRow');

import defaultStore from 'stores/templatesStore';

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
                    <span className="tau-icon-general tau-icon-plus" />
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
