var _ = require('Underscore');
var Event = require('tau/core/event');

var Store = function(testcase) {
    this.testcase = testcase;
    this.items = [];
};

_.extend(Store.prototype, {
    read() {
        this.items = _.deepClone(this.testcase.steps);
        this.fire('update');
    },

    reorderSteps(items, lastMovedTo) {
        this.items = items;
        this.lastMovedTo = lastMovedTo;
        this.fire('update');
    },

    createStep() {
        this.items.push({
            Description: 'Do something',
            Result: 'Get something'
        });
        this.fire('update');
    },

    editStep(step) {
        if (step.isEditing) {
            return;
        }

        this.items.forEach((v) => {
            v.isEditing = false;
        });

        step.isEditing = true;
        this.fire('update');
    },

    saveStep(step) {
        step.isEditing = false;
        this.fire('update');
    },

    removeStep(step) {
        this.items = _.without(this.items, step);
        this.fire('update');
    }
});

Event.implementOn(Store.prototype);

module.exports = Store;
