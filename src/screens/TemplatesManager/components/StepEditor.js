var React = require('react');
var StepEditorRow = require('./StepEditorRow');

var cx = React.addons.classSet;

var StepEditor = React.createClass({

    getDefaultProps: function() {
        return {
            store: null
        };
    },

    getInitialState: function() {
        return {
            isDragging: false
        };
    },

    componentDidMount: function() {

        this.updateHandler = function() {
            this.forceUpdate();
        }.bind(this);

        this.props.store.on('update', this.updateHandler);
        this.props.store.read();
    },

    componentWillUnmount: function() {
        this.props.store.removeListener('update', this.updateHandler);
    },

    render: function() {

        var dragData = {
            items: this.props.store.items,
            dragging: this.props.store.lastMovedTo
        };

        var steps = this.props.store.items.map(function(v, k) {
            return (
                <StepEditorRow
                    key={k}
                    id={k}
                    item={v}
                    data={dragData}
                    store={this.props.store}
                    sort={this.sort}
                />
            );
        }.bind(this));

        var header;

        if (steps.length) {

            var className = cx({
                'tm-stepeditor__inner': true,
                'tm-stepeditor__inner-dragging': this.state.isDragging
            });

            header = (
                <table>
                    <tr className="tm-stepeditor__header">
                        <th>Step</th>
                        <th>Result</th>
                        <th style={{width: 57}}></th>
                    </tr>
                    <tbody className={className}
                        onDragOver={this.handleDragOver}
                        onDrop={this.handleDrop}>
                        {steps}
                    </tbody>
                </table>
            );
        }

        return (
            <div className="tm-stepeditor">
                {header}
                <button className="tau-btn" onClick={this.handleAddStep}>Add step</button>
            </div>
        );
    },

    handleAddStep: function() {
        this.props.store.createStep();
    },

    handleDragOver: function() {
        if (!this.state.isDragging) {
            this.setState({
                isDragging: true
            });
        }
    },

    handleDrop: function() {
        this.setState({
            isDragging: false
        });
    },

    sort: function(steps, lastMovedTo) {
        this.props.store.reorderSteps(steps, lastMovedTo);
    }

});

module.exports = StepEditor;
