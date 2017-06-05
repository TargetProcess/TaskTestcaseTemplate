var React = require('react');
var Form = require('./TemplatesManagerTestCaseForm');

var TemplatesManagerTestCase = React.createClass({
    render() {
        var item = this.props.item;
        var inner;

        if (item.status === 'edit') {
            inner = <Form item={item} store={this.props.store} />;
        } else {
            inner = (
                <div className="view-mode">
                    <div className="entity-name" onClick={this.handleStartEdit}>
                        <span>{item.Name}</span>
                    </div>
                </div>
            );
        }

        return <div className="tm-item">{inner}</div>;
    },

    handleStartEdit() {
        this.props.store.editTestCase(this.props.item);
    }
});

module.exports = TemplatesManagerTestCase;
