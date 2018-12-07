var _ = require('Underscore');
var React = require('react/addons');
var TemplatesManagerTestCase = require('./TemplatesManagerTestCase');
var TemplatesManagerTask = require('./TemplatesManagerTask');

var cx = React.addons.classSet;

const Directions = {
    TOP: 'top',
    BOTTOM: 'bottom',
    LEFT: 'left',
    RIGHT: 'right'
};

const Rotations = {
    [Directions.LEFT]: -270,
    [Directions.TOP]: -180,
    [Directions.BOTTOM]: 0,
    [Directions.RIGHT]: -90
};


// TODO: switch to create-mashup-app because webpack 1 doesn't work with lodash-es and new componenets in package
class CaretIcon extends React.Component {
    render() {
        return (
            <svg
                style={{
                    transform: `rotate(${Rotations[this.props.direction]}deg)`,
                    display: 'block',
                    transition: 'transform 0.3s'
                }}
                width={16}
                height={16}
                viewBox={`0 0 ${16} ${16}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.7071 4.79289C14.0976 5.18342 14.0976 5.81658 13.7071 6.20711L8.70711 11.2071C8.31658 11.5976 7.68342 11.5976 7.29289 11.2071L2.29289 6.20711C1.90237 5.81658 1.90237 5.18342 2.29289 4.79289C2.68342 4.40237 3.31658 4.40237 3.70711 4.79289L8 9.08579L12.2929 4.79289C12.6834 4.40237 13.3166 4.40237 13.7071 4.79289Z"
                    fill="#404249" />
            </svg>
        );
    }
}

var TemplatesManagerRow = React.createClass({
    renderInnerItem(item) {
        if (item.status === 'edit') {
            return (
                <form className="tm-name" onSubmit={this.handleSaveForm}>
                    <input autoFocus defaultValue={item.name} onBlur={this.handleSave} ref="name" type="text" />
                </form>
            );
        }

        return (
            <div className="tm-name editableText" onClick={this.handleStartEdit}>
                <span>{item.name}</span>
            </div>
        );
    },

    render() {
        var item = this.props.item;
        var tasksCount = _.filter(item.tasks, (v) => v.Id).length;
        var testCasesCount = _.filter(item.testCases, (v) => v.Id).length;

        var hasNewTask = Boolean(item.tasks.length - tasksCount);
        var hasNewTestCase = Boolean(item.testCases.length - testCasesCount);

        var expanded;

        if (item.isExpanded) {
            var store = this.props.store;

            var testCases = item.testCases.map(
                (v) => <TemplatesManagerTestCase item={v} key={`testcase${v.Id}`} store={store} />);

            var tasks = item.tasks.map(
                (v) => <TemplatesManagerTask item={v} key={`task${v.Id}`} store={store} />);

            expanded = (
                <tr className="edit-line">
                    <td className="td-task" colSpan="3">
                        <div className="tm-caption">
                            <b className="task">Tasks</b>
                            <span className="counter">{tasksCount}</span>
                            <button
                                className="tau-btn tau-btn-small tau-success tau-btn-quick-add"
                                disabled={hasNewTask}
                                onClick={this.handleCreateTask}
                            />
                        </div>
                        <div className="tm-body">
                            {tasks}
                        </div>
                    </td>
                    <td className="td-test-case">
                        <div className="tm-caption">
                            <b className="test-case">Test Cases</b>
                            <span className="counter">{testCasesCount}</span>
                            <button
                                className="tau-btn tau-btn-small tau-success tau-btn-quick-add"
                                disabled={hasNewTestCase}
                                onClick={this.handleCreateTestCase}
                            />
                        </div>
                        <div className="tm-body">
                            {testCases}
                        </div>
                    </td>
                </tr>
            );
        }

        var className = cx({
            'info-line': true,
            'active': item.isExpanded // eslint-disable-line quote-props
        });

        return (
            <tbody>
                <tr className={className}>
                    <td className="td-name">
                        <div className="td-name-inner">
                            <span onClick={this.handleToggleRow} className="tm-expander">
                                <CaretIcon direction={item.isExpanded ? 'bottom' : 'right'} />
                            </span>
                            {this.renderInnerItem(item)}
                        </div>
                    </td>
                    <td className="td-entities">
                        <span className="entity-icon entity-task">T</span>
                        <span className="counter">{tasksCount}</span>
                    </td>
                    <td className="td-entities">
                        <span className="entity-icon entity-test-case">TC</span>
                        <span className="counter">{testCasesCount}</span>
                    </td>
                    <td className="td-actions">
                        <button
                            className="tau-btn tau-attention"
                            onClick={this.handleRemove}
                            type="button"
                        >Delete</button>
                        <button
                            className="tau-btn tau-primary"
                            onClick={this.handleApply}
                            type="button"
                        >Apply template</button>
                    </td>
                </tr>
                {expanded}
            </tbody>
        );
    },

    handleToggleRow() {
        this.props.store.toggleExpand(this.props.item);
    },

    handleCreateTask() {
        this.props.store.createTask(this.props.item);
    },

    handleCreateTestCase() {
        this.props.store.createTestCase(this.props.item);
    },

    handleApply() {
        this.props.store.applyTemplate(this.props.item);
    },

    handleRemove() {
        this.props.store.removeTemplate(this.props.item);
    },

    handleStartEdit() {
        this.props.store.editTemplate(this.props.item);
    },

    handleSave() {
        var val = this.refs.name.getDOMNode().value.trim();
        if (val) {
            this.props.item.name = val;
            this.props.store.saveTemplate(this.props.item);
        }
    },

    handleSaveForm(e) {
        e.preventDefault();

        var val = this.refs.name.getDOMNode().value.trim();
        if (val) {
            this.props.item.name = val;
            this.props.store.saveTemplate(this.props.item);
        }
    }
});

module.exports = TemplatesManagerRow;
