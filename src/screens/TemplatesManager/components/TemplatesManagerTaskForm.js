/* eslint-disable react/no-danger */
var React = require('react');

var TemplatesManagerTaskForm = React.createClass({
    render() {
        var item = this.props.item;

        return (
            <div className="view-mode active">
                <div className="entity-name">
                    <input autoFocus defaultValue={item.Name} placeholder="Name" ref="name" type="text" />
                </div>
                <div className="edit-block">
                    <div className="note">Description</div>
                    <div
                        className="tm-description"
                        contentEditable
                        dangerouslySetInnerHTML={{__html: item.Description}}
                        ref="description"
                    />

                    <div className="action-buttons">
                        <button className="tau-btn tau-success left" onClick={this.handleSave} type="button">
                            {item.Id ? 'Save Task' : 'Add Task'}
                        </button>
                        <button className="tau-btn tau-attention right" onClick={this.handleRemove} type="button">
                            {item.Id ? 'Delete' : 'Cancel'}
                        </button>
                    </div>
                </div>
            </div>
        );
    },

    handleSave() {
        var item = this.props.item;
        var val = this.refs.name.getDOMNode().value.trim();
        if (val) {
            item.Name = val;
            item.Description = this.refs.description.getDOMNode().innerHTML || '';
            this.props.store.saveTask(this.props.item);
        }
    },

    handleRemove() {
        this.props.store.removeTask(this.props.item);
    }
});

module.exports = TemplatesManagerTaskForm;
