var $ = require('jQuery');
var _ = require('Underscore');
var Event = require('tau/core/event');

import configurator from 'tau/configurator';

const appPath = configurator.getApplicationPath();

const fetchData = () =>
    $
        .ajax({
            type: 'GET',
            url: `${appPath}/storage/v1/ApplyTemplateMashup/?where=(scope == "Public")&select={publicData,key}`,
            contentType: 'application/json; charset=utf8'
        })
        .then(({items}) => items);

const getTeamOfUserStory = (userStory) => {
    if (userStory.responsibleTeam) {
        return userStory.responsibleTeam.team;
    }

    if (userStory.teamIteration) {
        return userStory.teamIteration.team;
    }

    return null;
};

var store = {
    items: [],

    read() {
        if (this.items) {
            this.fire('update');
        }

        $.when(fetchData())
            .then((items) => {
                this.items = items.map(function(v) {
                    var testCases = _.compact(JSON.parse(v.publicData.testCases) || []);
                    testCases = testCases.map((v) => {
                        v.steps = v.steps || [];
                        return v;
                    });

                    return {
                        key: v.key,
                        isExpanded: v.isExpanded,
                        name: v.publicData.name,
                        tasks: _.compact(JSON.parse(v.publicData.tasks) || []),
                        testCases: testCases
                    };
                });

                this.fire('update');
            });
    },

    createTemplate() {
        var template = {
            key: 0,
            name: 'New Template',
            tasks: [],
            testCases: []
        };

        this.write(template).then(function(res) {
            template.key = res.key;
            this.items.push(template);
            this.fire('update');
        }.bind(this));
    },

    toggleExpand(template) {
        template.isExpanded = !template.isExpanded;

        this.items.forEach(function(v) {
            if (v !== template || !template.isExpanded) {
                v.status = '';

                v.tasks.forEach((v) => {
                    v.status = '';
                });

                v.testCases.forEach((v) => {
                    if (v.status === 'edit') {
                        v.status = '';
                    }
                });
            }
        });

        this.fire('update');
    },

    editTemplate(template) {
        template.status = 'edit';
        this.fire('update');
    },

    saveTemplate(item) {
        item.status = '';
        this.write(item);
        this.fire('update');
    },

    removeTemplate(item) {
        this.items = _.without(this.items, item);

        $.ajax({
            type: 'POST',
            url: `${this.configurator.getApplicationPath()}/storage/v1/ApplyTemplateMashup/${item.key}`,
            contentType: 'application/json; charset=utf8',
            beforeSend(xhr) {
                xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE');
            }
        });

        this.fire('update');
    },

    applyTemplate(template) {
        return this
            .getCurrentEntity()
            .then((userStory) => {
                var tasksToSave = _.filter(template.tasks, (v) => v.Name);
                var testCasesToSave = _.filter(template.testCases, (v) => v.Name);

                var tasks = tasksToSave.reduce(
                    (res, item) => res.then(() => this.createTaskByTemplate(item, userStory)), $.when(true));

                var testCases = testCasesToSave.reduce(
                    (res, item) => res.then(() => this.createTestCaseByTemplate(item, userStory)), $.when(true));

                return $.when(tasks, testCases);
            });
    },

    createTaskByTemplate(task, userStory) {
        const store = this.configurator.getStore();
        var taskId = null;

        return store
            .saveDef('tasks', {
                $set: {
                    Name: task.Name,
                    Description: task.Description,
                    UserStory: {Id: userStory.id},
                    Project: {Id: userStory.project ? userStory.project.id : null}
                },
                fields: ['id', 'name', {userStory: ['id']}]
            })
            .then((res) => {
                taskId = res.data.id;
            })
            .then(() => {
                const team = getTeamOfUserStory(userStory);
                if (!team) {
                    return null;
                }

                return store.saveDef('teamAssignments', {
                    $set: {
                        Assignable: {id: taskId},
                        Team: {id: team.id}
                    }
                });
            })
            .then(() => {
                const teamIteration = userStory.teamIteration;
                if (!teamIteration || !teamIteration.id) {
                    return null;
                }

                return store.saveDef('tasks', {
                    id: taskId,
                    $set: {
                        teamIteration: {id: teamIteration.id}
                    },
                    fields: ['id', 'name', {teamIteration: ['id', 'name']}]
                });
            });
    },

    createTestCaseByTemplate(testCase, userStory) {
        var store = this.configurator.getStore();
        // eslint-disable-next-line no-underscore-dangle
        var isLinkedTestCaseEnabled = Boolean(store.config.proxy.db.__types.assignable.refs.linkedTestPlan);
        var isBoard = this.configurator.isBoardEdition;

        var saveTestCase;

        if (isLinkedTestCaseEnabled && isBoard) {
            saveTestCase = $
                .when(this.getOrCreateLinkedTestPlan(userStory))
                .then(function(linkedTestPlan) {
                    return store.saveDef('testCases', {
                        $set: {
                            Name: testCase.Name,
                            Description: this.getTestCaseDescription(testCase),
                            TestPlans: [{Id: linkedTestPlan.id}],
                            Project: {Id: userStory.project.id}
                        },
                        fields: ['id', 'name']
                    });
                }.bind(this));
        } else {
            saveTestCase = store
                .saveDef('testCases', {
                    $set: {
                        Name: testCase.Name,
                        Description: this.getTestCaseDescription(testCase),
                        UserStory: {Id: userStory.id},
                        Project: {Id: userStory.project.id}
                    },
                    fields: ['id', 'name', {userStory: ['id']}]
                })
                .then(function(res) {
                    var savedEntity = res.data;
                    var entity = userStory;
                    var relationName = 'testCases';

                    this.configurator.getGlobalBus().fire('testCase.items.added', {
                        entity: {id: savedEntity.id},
                        'evict-data': {
                            entityId: entity.id,
                            entityType: 'userStory',
                            evictProperties: [relationName]
                        }
                    });

                    return res;
                }.bind(this));
        }

        return saveTestCase
            .then(function(res) {
                var id = res.data.id;
                return testCase.steps.reduce(function(res, item, k) {
                    return res.then(() => store.saveDef('testSteps', {
                        $set: {
                            TestCase: {Id: id},
                            Description: item.Description,
                            Result: item.Result,
                            RunOrder: k + 1
                        }
                    }));
                }, $.when(true));
            });
    },

    getOrCreateLinkedTestPlan(userStory) {
        var store = this.configurator.getStore();
        return store
            .getDef('UserStory', {
                id: userStory.id,
                fields: [{linkedTestPlan: ['Id']}]
            })
            .then(function(res) {
                if (res.linkedTestPlan) {
                    return res.linkedTestPlan;
                }

                return $
                    .ajax({
                        type: 'post',
                        url: `${this.configurator.getApplicationPath()}/linkedtestplan/v1/migrateUserStory`,
                        contentType: 'application/json; charset=utf8',
                        data: JSON.stringify({userStoryId: userStory.id})
                    })
                    .then((testPlan) => {
                        store.evictProperties(testPlan.linkedGeneral.id,
                            testPlan.linkedGeneral.entityType.name, ['linkedTestPlan']);
                        store.registerWithEvents(_.extend(testPlan, {__type: 'testplan'}));
                        return testPlan;
                    });
            }.bind(this));
    },

    getTestCaseDescription(item) {
        var description = item.Description;
        if (!description && (item.Steps || item.Success)) {
            description = '<h4>Steps</h4>' + (item.Steps || '') + '<br /><br /><h4>Success</h4>' + (item.Success || '');
        }

        return description;
    },

    getCurrentEntity() {
        var id = this.entity.id;

        return this.configurator.getStore().getDef('UserStory', {
            id: id,
            fields: [
                {project: ['id']},
                {responsibleTeam: [{team: ['id']}]},
                {teamIteration: [{team: ['id']}]}
            ]
        });
    },

    editTask(task) {
        var template = _.find(this.items, (item) => _.indexOf(item.tasks, task) >= 0);
        template.tasks.forEach((v) => {
            v.status = '';
        });
        task.status = 'edit';
        this.fire('update');
    },

    removeTask(task) {
        var template = _.find(this.items, (item) => _.indexOf(item.tasks, task) >= 0);
        template.tasks = _.without(template.tasks, task);
        this.write(template);
        this.fire('update');
    },

    saveTask(task) {
        var template = _.find(this.items, (item) => _.indexOf(item.tasks, task) >= 0);
        task.Id = task.Id || Number(new Date());
        task.status = '';
        this.write(template);
        this.fire('update');
    },

    createTask(template) {
        var hasEdit = _.findWhere(template.tasks, {Id: 0});
        if (!hasEdit) {
            template.tasks.unshift({Id: 0, Name: '', Description: '', status: 'edit'});
            this.fire('update');
        }
    },

    editTestCase(testCase) {
        var template = _.find(this.items, (item) => _.indexOf(item.testCases, testCase) >= 0);

        template.testCases.forEach((v) => {
            if (v.status === 'edit') {
                v.status = '';
            }
        });

        testCase.status = 'edit';
        this.fire('update');
    },

    removeTestCase(task) {
        var template = _.find(this.items, (item) => _.indexOf(item.testCases, task) >= 0);
        template.testCases = _.without(template.testCases, task);
        this.fire('update');
        this.write(template);
    },

    saveTestCase(testcase) {
        var template = _.find(this.items, (item) => _.indexOf(item.testCases, testcase) >= 0);
        testcase.Id = testcase.Id || Number(new Date());
        testcase.status = '';
        this.fire('update');
        this.write(template);
    },

    createTestCase(template) {
        var hasEdit = _.findWhere(template.testCases, {Id: 0});
        if (!hasEdit) {
            template.testCases.unshift({Id: 0, Name: '', Description: '', status: 'edit', steps: []});
            this.fire('update');
        }
    },

    write(template) {
        var templateData = _.pick(template, 'name');

        ['tasks', 'testCases'].forEach(function(key) {
            templateData[key] = JSON.stringify(_.compact(template[key].map(function(v) {
                if (!v.Id || v.status === 'edit') {
                    return null;
                }

                var item = _.clone(v);
                delete item.status;
                return item;
            })));
        });

        return $.ajax({
            type: 'POST',
            url: `${this.configurator.getApplicationPath()}/storage/v1/ApplyTemplateMashup/`,
            contentType: 'application/json; charset=utf8',
            data: JSON.stringify({
                key: template.key || '',
                scope: 'Public',
                publicData: templateData,
                userData: null
            })
        });
    }
};

Event.implementOn(store);

module.exports = store;
