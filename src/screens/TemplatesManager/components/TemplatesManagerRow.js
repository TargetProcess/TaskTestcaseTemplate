var _ = require('Underscore');
var React = require('react/addons');
var TemplatesManagerTestCase = require('./TemplatesManagerTestCase');
var TemplatesManagerTask = require('./TemplatesManagerTask');

var cx = React.addons.classSet;

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

        var spanClassName = cx({
            'tm-expander tau-icon-general': true,
            'tau-icon-b-direction active': item.isExpanded,
            'tau-icon-r-direction': !item.isExpanded
        });

        return (
            <tbody>
                <tr className={className}>
                    <td className="td-name">
                        <div className="td-name-inner">
                            <span className={spanClassName} onClick={this.handleToggleRow} />
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
