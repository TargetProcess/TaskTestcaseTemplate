/* eslint-disable react/no-danger */
var React = require('react');
var StepEditor = require('./StepEditor');
var StepsStore = require('stores/stepsStore');

var TemplatesManagerTestCaseForm = React.createClass({
    getInitialState() {
        return {
            stepsStore: new StepsStore(this.props.item)
        };
    },

    render() {
        var item = this.props.item;
        var description = this.props.store.getTestCaseDescription(item);

        return (
            <div className="view-mode active">
                <div className="entity-name">
                    <input
                        autoFocus
                        defaultValue={item.Name}
                        placeholder="Name"
                        ref="name"
                        type="text"
                    />
                </div>

                <div className="edit-block">
                    <div className="note">Description</div>
                    <div
                        className="tm-description"
                        contentEditable
                        dangerouslySetInnerHTML={{__html: description}}
                        ref="description"
                    />
                </div>

                <div className="edit-block">
                    <StepEditor store={this.state.stepsStore} />

                    <div className="action-buttons">
                        <button
                            className="tau-btn tau-success left"
                            onClick={this.handleSave}
                            type="button"
                        >
                            {item.Id ? 'Save Test Case' : 'Add Test Case'}
                        </button>
                        <button
                            className="tau-btn tau-attention right"
                            onClick={this.handleRemove}
                            type="button"
                        >
                            {item.Id ? 'Delete' : 'Cancel'}
                        </button>
                    </div>
                </div>
            </div>
        );
    },

    handleSave() {
        var val = this.refs.name.getDOMNode().value.trim();
        if (val) {
            var item = this.props.item;
            item.Name = val;
            item.Description = this.refs.description.getDOMNode().innerHTML || '';
            item.steps = this.state.stepsStore.items;
            this.props.store.saveTestCase(item);
        }
    },

    handleRemove() {
        this.props.store.removeTestCase(this.props.item);
    }
});

module.exports = TemplatesManagerTestCaseForm;
