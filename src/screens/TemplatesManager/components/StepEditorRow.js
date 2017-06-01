/* eslint-disable react/no-danger */
var React = require('react/addons');

var cx = React.addons.classSet;

var Sortable = {
    update(to, from) {
        var data = this.props.data.items;
        data.splice(to, 0, data.splice(from, 1)[0]);
        this.props.sort(data, to);
    },

    sortEnd() {
        this.props.sort(this.props.data.items, void 0);
    },

    sortStart(e) {
        this.dragged = e.currentTarget.dataset ?
            e.currentTarget.dataset.id :
            e.currentTarget.getAttribute('data-id');
        e.dataTransfer.effectAllowed = 'move';
        try {
            e.dataTransfer.setData('text/html', null);
        } catch (ex) {
            e.dataTransfer.setData('text', '');
        }
    },

    move(over, append) {
        var to = Number(over.dataset.id);
        var from = this.props.data.dragging || Number(this.dragged);
        if (append) {
            to++;
        }
        if (from < to) {
            to--;
        }
        this.update(to, from);
    },

    dragOver(e) {
        e.preventDefault();
        var over = e.currentTarget;
        var relY = e.clientY - over.getBoundingClientRect().top;
        var height = over.offsetHeight / 2;
        var relX = e.clientY - over.getBoundingClientRect().left;
        var placement = this.placement ? this.placement(relX, relY, over) : relY > height;
        this.move(over, placement);
    },

    isDragging() {
        return this.props.data.dragging === this.props.id;
    }
};

var StepEditorRow = React.createClass({
    mixins: [Sortable],

    componentDidMount() {
        this.documentListener = function(e) {
            if (this.isMounted() && !this.refs.row.getDOMNode().contains(e.target) &&
                this.props.item.isEditing) {
                this.props.store.saveStep(this.props.item);
            }
        }.bind(this);

        document.addEventListener('click', this.documentListener);
    },

    componentDidUpdate() {
        if (this.refs.description) {
            this.refs.description.getDOMNode().focus();
        }
    },

    componentWillUnmount() {
        document.removeEventListener('click', this.documentListener);
    },

    render() {
        var className = cx({
            'tm-stepeditor__row': true,
            'tm-stepeditor__row-dragging': this.isDragging()
        });

        var tr = (
            <tr
                className={className}
                data-id={this.props.id}
                draggable={this.props.item.isEditing ? null : true}
                onDragEnd={this.sortEnd}
                onDragOver={this.dragOver}
                onDragStart={this.sortStart}
                ref="row"
            >

                <td onClick={this.handleEdit}>
                    <div
                        className="tm-description"
                        contentEditable={this.props.item.isEditing || null}
                        dangerouslySetInnerHTML={{__html: this.props.item.Description}}
                        onBlur={this.handleSubmit}
                        ref="description"
                    />
                </td>
                <td onClick={this.handleEdit}>
                    <div
                        className="tm-description"
                        contentEditable={this.props.item.isEditing || null}
                        dangerouslySetInnerHTML={{__html: this.props.item.Result}}
                        onBlur={this.handleSubmit}
                        ref="result"
                    />
                </td>
                <td style={{width: 57}}>
                    <button
                        className="tau-btn tau-attention tau-btn-small"
                        onClick={this.handleRemove}
                        type="button"
                    >
                        Delete
                    </button>
                </td>
            </tr>
        );

        return tr;
    },

    handleStopEdit() {
        this.props.store.saveStep(this.props.item);
    },

    handleEdit() {
        if (!this.props.item.isEditing) {
            this.props.store.editStep(this.props.item);
        }
    },

    handleRemove(e) {
        e.stopPropagation();
        this.props.store.removeStep(this.props.item);
    },

    handleSubmit(e) {
        if (e.relatedTarget &&
            (e.relatedTarget === this.refs.description.getDOMNode() ||
                e.relatedTarget === this.refs.result.getDOMNode())
        ) {
            return;
        }

        this.props.item.Description = this.refs.description.getDOMNode().innerHTML;
        this.props.item.Result = this.refs.result.getDOMNode().innerHTML;
    }
});

module.exports = StepEditorRow;
