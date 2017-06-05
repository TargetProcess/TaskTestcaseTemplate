var React = require('react/addons');
var StepEditorRow = require('./StepEditorRow');

var cx = React.addons.classSet;

var StepEditor = React.createClass({
    getDefaultProps() {
        return {
            store: null
        };
    },

    getInitialState() {
        return {
            isDragging: false
        };
    },

    componentDidMount() {
        this.updateHandler = function() {
            this.forceUpdate();
        }.bind(this);

        this.props.store.on('update', this.updateHandler);
        this.props.store.read();
    },

    componentWillUnmount() {
        this.props.store.removeListener('update', this.updateHandler);
    },

    render() {
        var store = this.props.store;

        var dragData = {
            items: store.items,
            dragging: store.lastMovedTo
        };

        var steps = store.items.map(
            (v, k) => <StepEditorRow data={dragData} id={k} item={v} key={k} sort={this.sort} store={store} />);

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
                        <th style={{width: 57}} />
                    </tr>
                    <tbody className={className} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
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

    handleAddStep() {
        this.props.store.createStep();
    },

    handleDragOver() {
        if (!this.state.isDragging) {
            this.setState({
                isDragging: true
            });
        }
    },

    handleDrop() {
        this.setState({
            isDragging: false
        });
    },

    sort(steps, lastMovedTo) {
        this.props.store.reorderSteps(steps, lastMovedTo);
    }
});

module.exports = StepEditor;
