/*! v0.1.0 Build Fri Nov 13 2015 18:21:30 GMT+0300 (MSK) */
!function(){var t={},e=function(){var e,i,n,a=Array.prototype.slice.call(arguments,0);"string"==typeof a[0]?(n=a[0],e=a[1],i=a[2]):Array.isArray(a[0])&&(e=a[0],i=a[1]);var s=e.reduce(function(t,e){return t.addDependency(e)},tau.mashups);return s=s.addDependency(n+"/config"),s=s.addMashup(function(){var a=Array.prototype.slice.call(arguments,0);if(e.length>0&&1===a.length)throw new Error("Can't properly load dependencies for mashup \""+n+'", mashup is stopped.');return t.variables=a[a.length-1],a.length-e.length===2?t.config=a[a.length-2]:t.config={},Object.freeze&&(Object.freeze(t.variables),Object.freeze(t.config),Object.freeze(t)),i.apply(null,a)})};e("TaskTestcaseTemplate",["jQuery","Underscore","tau/configurator","tau/core/event","react","tp/userStory/view","tau/utils/utils.date","tau/components/component.container","tau/components/component.creator","tau/service.container","tau/services/service.navigator","tau/services/service.applicationContext","tau/components/component.application.generic","tau/ui/extensions/application.generic/ui.extension.application.generic.placeholder","tau/components/component.page.base","tau/core/class","tau/core/extension.base","tau/core/bus.reg","tp3/mashups/storage","tau/core/templates-factory","tau/core/view-base","tau/services/service.customFields.cached","tau/libs/store2/store2"],function(e,i,n,a,s,r,o,d,p,c,l,u,m,h,f,g,v,b,x,y,E,k,T){return function(e){function i(t){if(n[t])return n[t].exports;var a=n[t]={exports:{},id:t,loaded:!1};return e[t].call(a.exports,a,a.exports,i),a.loaded=!0,a.exports}var n={};return i.m=e,i.c=n,i.p="",i.p=t.variables?t.variables.mashupPath:i.p,i(0)}([function(t,e,i){i(3),i(11),i(9),i(25),i(26),i(27),i(28),i(29),i(30),i(31),i(32),i(33),i(34),i(35),i(36),i(37),i(38),i(39),i(40),t.exports=i(41)},,,function(e,i,n){"use strict";function a(t){return t&&t.__esModule?t:{"default":t}}var s=n(4),r=a(s),o=n(5),d=n(6),p=a(d),c=n(11),l=n(20),u=n(9);n(21);var m=function(){var t=!1,e=new r["default"].Deferred;return u.getGlobalBus().on("configurator.ready",function(i,n){t||n._id.match(/global/)||(t=!0,e.resolve(n))}),function(){return e.promise()}},h=m(),f=function(t){return h().then(function(e){return e.getStore().getDef(t.entityType.name,{id:t.id,fields:[{project:["Id"]}]})}).then((0,o.property)("project"))},g=function(t,e){var i=e.showOnProjects;if(!i)return!0;var n=function(t){return i.indexOf(t.id)>=0};return i.length?t.hasOwnProperty("projectId")?n({od:t.projectId}):void f(t).then(function(t){return Boolean(t)&&n(t)}).fail(function(){return!1}):!1},v=function(t,e,i){r["default"].when(g(t,i),h()).then(function(i,n){c.render(c.createElement(p["default"],{configurator:n,disabled:!i,entity:t}),e)})},b=t.config;l.addTab("Template",function(t,e){var i=e.entity;return v(i,t[0],b)},o.noop,{getViewIsSuitablePromiseCallback:function(t){var e=t.entity,i=g(e,b);return i.then?i:(new r["default"].Deferred).resolve(i).promise()}})},function(t,i){t.exports=e},function(t,e){t.exports=i},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var a=i(7),s=n(a);e["default"]=s["default"]},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}var a=i(8),s=n(a),r=i(11),o=i(12),d=r.createClass({displayName:"TemplatesManager",getDefaultProps:function(){return{disabled:!1,store:s["default"]}},componentDidMount:function(){s["default"].entity=this.props.entity,s["default"].configurator=this.props.configurator,this.updateHandler=function(){this.forceUpdate()}.bind(this),this.props.store.on("update",this.updateHandler),this.disabled||this.props.store.read()},componentWillUnmount:function(){this.props.store.removeListener("update",this.updateHandler)},render:function(){var t=this.props,e=t.disabled,i=t.store;return e?null:r.createElement("div",{className:"templates-mashap"},r.createElement("div",{className:"tm-add-btn tau-icons-general-before",onClick:this.handleCreateTemplate},"Add template"),r.createElement("table",{className:"tm-grid"},i.items.map(function(t){return r.createElement(o,{item:t,key:t.key,store:i})})))},handleCreateTemplate:function(){this.props.store.createTemplate()}});t.exports=d},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}var a=i(9),s=n(a),r=i(4),o=i(5),d=i(10),p=s["default"].getApplicationPath(),c=function(){return r.ajax({type:"GET",url:p+'/storage/v1/ApplyTemplateMashup/?where=(scope == "Public")&select={publicData,key}',contentType:"application/json; charset=utf8"}).then(function(t){var e=t.items;return e})},l={items:[],read:function(){var t=this;this.items&&this.fire("update"),r.when(c()).then(function(e){t.items=e.map(function(t){var e=o.compact(JSON.parse(t.publicData.testCases)||[]);return e=e.map(function(t){return t.steps=t.steps||[],t}),{key:t.key,isExpanded:t.isExpanded,name:t.publicData.name,tasks:o.compact(JSON.parse(t.publicData.tasks)||[]),testCases:e}}),t.fire("update")})},createTemplate:function(){var t={key:0,name:"New Template",tasks:[],testCases:[]};this.write(t).then(function(e){t.key=e.key,this.items.push(t),this.fire("update")}.bind(this))},expandTemplate:function(t){this.items.forEach(function(e){e!==t&&(e.isExpanded=!1,e.status="",e.tasks.forEach(function(t){t.status=""}),e.testCases.forEach(function(t){"edit"===t.status&&(t.status="")}))}),t.isExpanded=!0,this.fire("update")},editTemplate:function(t){t.status="edit",this.fire("update")},saveTemplate:function(t){t.status="",this.write(t),this.fire("update")},removeTemplate:function(t){this.items=o.without(this.items,t),r.ajax({type:"POST",url:this.configurator.getApplicationPath()+"/storage/v1/ApplyTemplateMashup/"+t.key,contentType:"application/json; charset=utf8",beforeSend:function(t){t.setRequestHeader("X-HTTP-Method-Override","DELETE")}}),this.fire("update")},applyTemplate:function(t){return this.getCurrentEntity().then(function(e){var i=o.filter(t.tasks,function(t){return t.Name}),n=o.filter(t.testCases,function(t){return t.Name}),a=i.reduce(function(t,i){return t.then(function(){return this.createTaskByTemplate(i,e)}.bind(this))}.bind(this),r.when(!0)),s=n.reduce(function(t,i){return t.then(function(){return this.createTestCaseByTemplate(i,e)}.bind(this))}.bind(this),r.when(!0));return r.when(a,s)}.bind(this))},createTaskByTemplate:function(t,e){return this.configurator.getStore().saveDef("tasks",{$set:{Name:t.Name,Description:t.Description,UserStory:{Id:e.id},Project:{Id:e.project.id}},fields:["id","name",{userStory:["id"]}]})},createTestCaseByTemplate:function(t,e){var i,n=this.configurator.getStore(),a=Boolean(n.config.proxy.db.__types.assignable.refs.linkedTestPlan),s=this.configurator.isBoardEdition;return i=a&&s?r.when(this.getOrCreateLinkedTestPlan(e)).then(function(i){return n.saveDef("testCases",{$set:{Name:t.Name,Description:this.getTestCaseDescription(t),TestPlans:[{Id:i.id}],Project:{Id:e.project.id}},fields:["id","name"]})}.bind(this)):n.saveDef("testCases",{$set:{Name:t.Name,Description:this.getTestCaseDescription(t),UserStory:{Id:e.id},Project:{Id:e.project.id}},fields:["id","name",{userStory:["id"]}]}).then(function(t){var i=t.data,n=e,a="testCases";return this.configurator.getGlobalBus().fire("testCase.items.added",{entity:{id:i.id},"evict-data":{entityId:n.id,entityType:"userStory",evictProperties:[a]}}),t}.bind(this)),i.then(function(e){var i=e.data.id,a=t.steps,s=a.reduce(function(t,e,a){return t.then(function(){return n.saveDef("testSteps",{$set:{TestCase:{Id:i},Description:e.Description,Result:e.Result,RunOrder:a+1}})})},r.when(!0));return s})},getOrCreateLinkedTestPlan:function(t){var e=this.configurator.getStore();return e.getDef("UserStory",{id:t.id,fields:[{linkedTestPlan:["Id"]}]}).then(function(i){return i.linkedTestPlan?i.linkedTestPlan:r.ajax({type:"post",url:this.configurator.getApplicationPath()+"/linkedtestplan/v1/migrateUserStory",contentType:"application/json; charset=utf8",data:JSON.stringify({userStoryId:t.id})}).then(function(t){return e.evictProperties(t.linkedGeneral.id,t.linkedGeneral.entityType.name,["linkedTestPlan"]),e.registerWithEvents(o.extend(t,{__type:"testplan"})),t})}.bind(this))},getTestCaseDescription:function(t){var e=t.Description;return t.Description||!t.Steps&&!t.Success||(e="<h4>Steps</h4>"+(t.Steps||"")+"<br /><br /><h4>Success</h4>"+(t.Success||"")),e},getCurrentEntity:function(){var t=this.entity.id;return this.configurator.getStore().getDef("UserStory",{id:t,fields:[{project:["id"]}]})},editTask:function(t){var e=o.find(this.items,function(e){return o.indexOf(e.tasks,t)>=0});e.tasks.forEach(function(t){t.status=""}),t.status="edit",this.fire("update")},removeTask:function(t){var e=o.find(this.items,function(e){return o.indexOf(e.tasks,t)>=0});e.tasks=o.without(e.tasks,t),this.write(e),this.fire("update")},saveTask:function(t){var e=o.find(this.items,function(e){return o.indexOf(e.tasks,t)>=0});t.Id=t.Id||Number(new Date),t.status="",this.write(e),this.fire("update")},createTask:function(t){var e=o.findWhere(t.tasks,{Id:0});e||(t.tasks.unshift({Id:0,Name:"",Description:"",status:"edit"}),this.fire("update"))},editTestCase:function(t){var e=o.find(this.items,function(e){return o.indexOf(e.testCases,t)>=0});e.testCases.forEach(function(t){"edit"===t.status&&(t.status="")}),t.status="edit",this.fire("update")},removeTestCase:function(t){var e=o.find(this.items,function(e){return o.indexOf(e.testCases,t)>=0});e.testCases=o.without(e.testCases,t),this.fire("update"),this.write(e)},saveTestCase:function(t){var e=o.find(this.items,function(e){return o.indexOf(e.testCases,t)>=0});t.Id=t.Id||Number(new Date),t.status="",this.fire("update"),this.write(e)},createTestCase:function(t){var e=o.findWhere(t.testCases,{Id:0});e||(t.testCases.unshift({Id:0,Name:"",Description:"",status:"edit",steps:[]}),this.fire("update"))},write:function(t){var e=o.pick(t,"name");return["tasks","testCases"].forEach(function(i){e[i]=JSON.stringify(o.compact(t[i].map(function(t){if(!t.Id||"edit"===t.status)return null;var e=o.clone(t);return delete e.status,e})))}),r.ajax({type:"POST",url:this.configurator.getApplicationPath()+"/storage/v1/ApplyTemplateMashup/",contentType:"application/json; charset=utf8",data:JSON.stringify({key:t.key||"",scope:"Public",publicData:e,userData:null})})}};d.implementOn(l),t.exports=l},function(t,e){t.exports=n},function(t,e){t.exports=a},function(t,e){t.exports=s},function(t,e,i){"use strict";var n=i(5),a=i(11),s=i(13),r=i(18),o=a.addons.classSet,d=a.createClass({displayName:"TemplatesManagerRow",render:function(){var t,e=this.props.item,i=n.filter(e.tasks,function(t){return t.Id}).length,d=n.filter(e.testCases,function(t){return t.Id}).length,p=Boolean(e.tasks.length-i),c=Boolean(e.testCases.length-d);if(e.isExpanded){var l=e.testCases.map(function(t){return a.createElement(s,{key:"testcase"+t.Id,item:t,store:this.props.store})}.bind(this)),u=e.tasks.map(function(t){return a.createElement(r,{key:"task"+t.Id,item:t,store:this.props.store})}.bind(this));t=a.createElement("tr",{className:"edit-line"},a.createElement("td",{className:"td-task",colSpan:"3"},a.createElement("div",{className:"tm-caption"},a.createElement("b",{className:"task"},"Tasks"),a.createElement("span",{className:"counter"},i),a.createElement("button",{className:"tau-btn tau-btn-small tau-success tau-icons-general-after",disabled:p,onClick:this.handleCreateTask})),a.createElement("div",{className:"tm-body"},u)),a.createElement("td",{className:"td-test-case"},a.createElement("div",{className:"tm-caption"},a.createElement("b",{className:"test-case"},"Test Cases"),a.createElement("span",{className:"counter"},d),a.createElement("button",{className:"tau-btn tau-btn-small tau-success tau-icons-general-after",disabled:c,onClick:this.handleCreateTestCase})),a.createElement("div",{className:"tm-body"},l)))}var m;m="edit"===e.status?a.createElement("div",{className:"tm-name tm-name-edit tau-icons-general-before editableText"},a.createElement("input",{type:"text",ref:"name",defaultValue:e.name,autoFocus:!0,onBlur:this.handleSave})):a.createElement("div",{className:"tm-name tau-icons-general-before editableText",onClick:this.handleStartEdit},a.createElement("span",null,e.name));var h=o({"info-line":!0,active:e.isExpanded});return a.createElement("tbody",null,a.createElement("tr",{className:h},a.createElement("td",{className:"td-name",onClick:this.handleToggleRow},m),a.createElement("td",{className:"td-entities"},a.createElement("span",{className:"entity-icon entity-task"},"T"),a.createElement("span",{className:"counter"},i)),a.createElement("td",{className:"td-entities"},a.createElement("span",{className:"entity-icon entity-test-case"},"TC"),a.createElement("span",{className:"counter"},d)),a.createElement("td",{className:"td-actions"},a.createElement("button",{type:"button",className:"tau-btn tau-attention",onClick:this.handleRemove},"Delete"),a.createElement("button",{type:"button",className:"tau-btn tau-primary",onClick:this.handleApply},"Apply template"))),t)},handleToggleRow:function(){this.props.store.expandTemplate(this.props.item)},handleCreateTask:function(){this.props.store.createTask(this.props.item)},handleCreateTestCase:function(){this.props.store.createTestCase(this.props.item)},handleApply:function(){this.props.store.applyTemplate(this.props.item)},handleRemove:function(){this.props.store.removeTemplate(this.props.item)},handleStartEdit:function(t){this.props.item.isExpanded&&(t.stopPropagation(),this.props.store.editTemplate(this.props.item))},handleSave:function(){var t=this.refs.name.getDOMNode().value.trim();t&&(this.props.item.name=t,this.props.store.saveTemplate(this.props.item))}});t.exports=d},function(t,e,i){"use strict";var n=i(11),a=i(14),s=n.createClass({displayName:"TemplatesManagerTestCase",render:function(){var t,e=this.props.item;return t="edit"===e.status?n.createElement(a,{item:e,store:this.props.store}):n.createElement("div",{className:"view-mode"},n.createElement("div",{className:"entity-name",onClick:this.handleStartEdit},n.createElement("span",null,e.Name))),n.createElement("div",{className:"tm-item"},t)},handleStartEdit:function(){this.props.store.editTestCase(this.props.item)}});t.exports=s},function(t,e,i){"use strict";var n=i(11),a=i(15),s=i(17),r=n.createClass({displayName:"TemplatesManagerTestCaseForm",getInitialState:function(){return{stepsStore:new s(this.props.item)}},render:function(){var t=this.props.item,e=this.props.store.getTestCaseDescription(t);return n.createElement("div",{className:"view-mode active"},n.createElement("div",{className:"entity-name"},n.createElement("input",{type:"text",ref:"name",defaultValue:t.Name,placeholder:"Name",autoFocus:!0})),n.createElement("div",{className:"edit-block"},n.createElement("div",{className:"note"},"Description"),n.createElement("div",{className:"tm-description",ref:"description",contentEditable:!0,dangerouslySetInnerHTML:{__html:e}})),n.createElement("div",{className:"edit-block"},n.createElement(a,{store:this.state.stepsStore}),n.createElement("div",{className:"action-buttons"},n.createElement("button",{type:"button",className:"tau-btn tau-success left",onClick:this.handleSave},t.Id?"Save Test Case":"Add Test Case"),n.createElement("button",{type:"button",className:"tau-btn tau-attention right",onClick:this.handleRemove},t.Id?"Delete":"Cancel"))))},handleSave:function(){var t=this.props.item,e=this.refs.name.getDOMNode().value.trim();e&&(t.Name=e,t.Description=this.refs.description.getDOMNode().innerHTML||"",t.steps=this.state.stepsStore.items,this.props.store.saveTestCase(this.props.item))},handleRemove:function(){this.props.store.removeTestCase(this.props.item)}});t.exports=r},function(t,e,i){"use strict";var n=i(11),a=i(16),s=n.addons.classSet,r=n.createClass({displayName:"StepEditor",getDefaultProps:function(){return{store:null}},getInitialState:function(){return{isDragging:!1}},componentDidMount:function(){this.updateHandler=function(){this.forceUpdate()}.bind(this),this.props.store.on("update",this.updateHandler),this.props.store.read()},componentWillUnmount:function(){this.props.store.removeListener("update",this.updateHandler)},render:function(){var t,e={items:this.props.store.items,dragging:this.props.store.lastMovedTo},i=this.props.store.items.map(function(t,i){return n.createElement(a,{key:i,id:i,item:t,data:e,store:this.props.store,sort:this.sort})}.bind(this));if(i.length){var r=s({"tm-stepeditor__inner":!0,"tm-stepeditor__inner-dragging":this.state.isDragging});t=n.createElement("table",null,n.createElement("tr",{className:"tm-stepeditor__header"},n.createElement("th",null,"Step"),n.createElement("th",null,"Result"),n.createElement("th",{style:{width:57}})),n.createElement("tbody",{className:r,onDragOver:this.handleDragOver,onDrop:this.handleDrop},i))}return n.createElement("div",{className:"tm-stepeditor"},t,n.createElement("button",{className:"tau-btn",onClick:this.handleAddStep},"Add step"))},handleAddStep:function(){this.props.store.createStep()},handleDragOver:function(){this.state.isDragging||this.setState({isDragging:!0})},handleDrop:function(){this.setState({isDragging:!1})},sort:function(t,e){this.props.store.reorderSteps(t,e)}});t.exports=r},function(t,e,i){"use strict";var n=i(11),a=n.addons.classSet,s={update:function(t,e){var i=this.props.data.items;i.splice(t,0,i.splice(e,1)[0]),this.props.sort(i,t)},sortEnd:function(){this.props.sort(this.props.data.items,void 0)},sortStart:function(t){this.dragged=t.currentTarget.dataset?t.currentTarget.dataset.id:t.currentTarget.getAttribute("data-id"),t.dataTransfer.effectAllowed="move";try{t.dataTransfer.setData("text/html",null)}catch(e){t.dataTransfer.setData("text","")}},move:function(t,e){var i=Number(t.dataset.id),n=this.props.data.dragging||Number(this.dragged);e&&i++,i>n&&i--,this.update(i,n)},dragOver:function(t){t.preventDefault();var e=t.currentTarget,i=t.clientY-e.getBoundingClientRect().top,n=e.offsetHeight/2,a=t.clientY-e.getBoundingClientRect().left,s=this.placement?this.placement(a,i,e):i>n;this.move(e,s)},isDragging:function(){return this.props.data.dragging===this.props.id}},r=n.createClass({displayName:"StepEditorRow",mixins:[s],componentDidMount:function(){this.documentListener=function(t){this.isMounted()&&!this.refs.row.getDOMNode().contains(t.target)&&this.props.item.isEditing&&this.props.store.saveStep(this.props.item)}.bind(this),document.addEventListener("click",this.documentListener)},componentDidUpdate:function(){this.refs.description&&this.refs.description.getDOMNode().focus()},componentWillUnmount:function(){document.removeEventListener("click",this.documentListener)},render:function(){var t=a({"tm-stepeditor__row":!0,"tm-stepeditor__row-dragging":this.isDragging()}),e=n.createElement("tr",{className:t,ref:"row","data-id":this.props.id,draggable:this.props.item.isEditing?null:!0,onDragEnd:this.sortEnd,onDragOver:this.dragOver,onDragStart:this.sortStart},n.createElement("td",{onClick:this.handleEdit},n.createElement("div",{className:"tm-description",ref:"description",contentEditable:this.props.item.isEditing||null,dangerouslySetInnerHTML:{__html:this.props.item.Description},onBlur:this.handleSubmit})),n.createElement("td",{onClick:this.handleEdit},n.createElement("div",{className:"tm-description",ref:"result",contentEditable:this.props.item.isEditing||null,dangerouslySetInnerHTML:{__html:this.props.item.Result},onBlur:this.handleSubmit})),n.createElement("td",{style:{width:57}},n.createElement("button",{type:"button",className:"tau-btn tau-attention tau-btn-small",onClick:this.handleRemove},"Delete")));return e},handleStopEdit:function(){this.props.store.saveStep(this.props.item)},handleEdit:function(){this.props.item.isEditing||this.props.store.editStep(this.props.item)},handleRemove:function(t){t.stopPropagation(),this.props.store.removeStep(this.props.item)},handleSubmit:function(t){(!t.relatedTarget||t.relatedTarget!==this.refs.description.getDOMNode()&&t.relatedTarget!==this.refs.result.getDOMNode())&&(this.props.item.Description=this.refs.description.getDOMNode().innerHTML,this.props.item.Result=this.refs.result.getDOMNode().innerHTML)}});t.exports=r},function(t,e,i){"use strict";var n=i(5),a=i(10),s=function(t){this.testcase=t,this.items=[]};n.extend(s.prototype,{read:function(){this.items=n.deepClone(this.testcase.steps),this.fire("update")},reorderSteps:function(t,e){this.items=t,this.lastMovedTo=e,this.fire("update")},createStep:function(){this.items.push({Description:"Do something",Result:"Get something"}),this.fire("update")},editStep:function(t){t.isEditing||(this.items.forEach(function(t){t.isEditing=!1}),t.isEditing=!0,this.fire("update"))},saveStep:function(t){t.isEditing=!1,this.fire("update")},removeStep:function(t){this.items=n.without(this.items,t),this.fire("update")}}),a.implementOn(s.prototype),t.exports=s},function(t,e,i){"use strict";var n=i(11),a=i(19),s=n.createClass({displayName:"TemplatesManagerTask",render:function(){var t,e=this.props.item;return t="edit"===e.status?n.createElement(a,{item:e,store:this.props.store}):n.createElement("div",{className:"view-mode"},n.createElement("div",{className:"entity-name",onClick:this.handleStartEdit},n.createElement("span",null,e.Name))),n.createElement("div",{className:"tm-item"},t)},handleStartEdit:function(){this.props.store.editTask(this.props.item)}});t.exports=s},function(t,e,i){"use strict";var n=i(11),a=n.createClass({displayName:"TemplatesManagerTaskForm",render:function(){var t=this.props.item;return n.createElement("div",{className:"view-mode active"},n.createElement("div",{className:"entity-name"},n.createElement("input",{type:"text",ref:"name",placeholder:"Name",defaultValue:t.Name,autoFocus:!0})),n.createElement("div",{className:"edit-block"},n.createElement("div",{className:"note"},"Description"),n.createElement("div",{className:"tm-description",ref:"description",contentEditable:!0,dangerouslySetInnerHTML:{__html:t.Description}}),n.createElement("div",{className:"action-buttons"},n.createElement("button",{type:"button",className:"tau-btn tau-success left",onClick:this.handleSave},t.Id?"Save Task":"Add Task"),n.createElement("button",{type:"button",className:"tau-btn tau-attention right",onClick:this.handleRemove},t.Id?"Delete":"Cancel"))))},handleSave:function(){var t=this.props.item,e=this.refs.name.getDOMNode().value.trim();e&&(t.Name=e,t.Description=this.refs.description.getDOMNode().innerHTML||"",this.props.store.saveTask(this.props.item))},handleRemove:function(){this.props.store.removeTask(this.props.item)}});t.exports=a},function(t,e){t.exports=r},function(t,e,i){var n=i(22);"string"==typeof n&&(n=[[t.id,n,""]]);i(24)(n,{});n.locals&&(t.exports=n.locals)},function(t,e,i){e=t.exports=i(23)(),e.push([t.id,'.tm-grid .edit-line .tm-item .view-mode .entity-name:hover,.tm-grid .info-line:hover td{cursor:pointer}.templates-mashap{padding:20px 0 20px 20px;font-size:13px;font-family:OpenSans,Arial,Helvetica,sans-serif;color:#16343b}.templates-mashap .tm-add-btn{cursor:pointer;display:inline-block;vertical-align:top;position:relative;color:#8bb648;font-size:14px;font-weight:600;line-height:26px;padding:0 8px 0 24px;margin-bottom:10px;border-radius:2px}.templates-mashap .tm-add-btn:before{content:"";display:block;width:10px;height:10px;background-position:-60px -109px;position:absolute;top:8px;left:8px}.templates-mashap .tm-add-btn:hover{background-color:#e6eef8;color:#8596a7}.templates-mashap .tm-add-btn:hover:before{background-position:-110px -109px}.templates-mashap .tm-grid{width:100%;border-spacing:0;border-collapse:collapse;table-layout:fixed}.tm-grid td{vertical-align:top;padding:4px 5px}.tm-grid .td-name{width:42%}.tm-grid .td-entities{width:4%;color:#8596a7;font-size:11px;white-space:nowrap;padding-top:8px}.tm-grid .td-actions{text-align:right;width:50%}.tm-grid .info-line.active td,.tm-grid .info-line:hover td{background-color:#e6eef8}.tm-grid .td-name{padding:0 20px 0 0}.tm-grid .td-name .tm-name{display:inline-block;position:relative;padding:7px 22px 6px 26px;border:none;max-width:100%;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;line-height:0}.tm-grid .td-name .tm-name span{display:inline-block;line-height:20px;height:20px;max-width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box}.tm-grid .td-name .tm-name:before{content:"";display:block;background-position:-110px -158px;width:11px;height:11px;position:absolute;top:11px;left:8px}.tm-grid .active .td-name .tm-name:before{background-position:-60px -160px}.tm-grid .td-name .tm-name:hover{background-color:initial;background-position:100% .9em;color:#8596a7}.tm-grid .info-line.active .tm-name{color:#16343b;font-weight:600}.tm-grid .td-name .tm-name:hover span:after{content:"";height:0;display:block;border-bottom:dotted 1px #49626a;width:100%;margin-top:-1px}.tm-grid .info-line.active .tm-name:hover span:after{display:none}.tm-grid .info-line.active .tm-name:hover:after{content:"";width:20px;height:12px;position:absolute;top:11px;right:0}.tm-grid .active .tm-name.edit-mode span{background-color:#fff;border:1px solid #cbd1d6;border-top-color:#a3a7ab;padding:0 2px;min-width:150px}[contenteditable]:focus{outline:0}.tm-grid .td-actions .tau-btn{opacity:0;-moz-transition:opacity .2s linear;-webkit-transition:opacity .2s linear;transition:opacity .2s linear}.tm-grid .info-line.active .td-actions .tau-primary,.tm-grid .info-line:hover .td-actions .tau-primary{opacity:1}.tm-grid .td-actions .tau-btn.tau-attention{opacity:0;visibility:hidden;-moz-transition:opacity .2s linear;-webkit-transition:opacity .2s linear;transition:opacity .2s linear}.tm-grid .info-line.active .td-actions .tau-attention{opacity:1;visibility:visible}.templates-mashap .entity-icon{border-radius:2px;display:inline-block;margin:0 .2em;min-width:12px;padding:1px 2px;text-align:center;text-transform:uppercase;vertical-align:middle}.templates-mashap .td-entities .counter{vertical-align:middle;display:inline-block;padding:0 5px 0 2px}.templates-mashap .entity-icon.entity-task{background-color:#e8e8f0;color:#456}.templates-mashap .entity-icon.entity-test-case{background-color:#f8e4ce;color:#dd7709}.tm-grid .edit-line>td{background-color:#f2f6fb;padding:15px 15px 15px 18px}.tm-grid .edit-line .tm-caption{padding:0 0 6px 8px;font-size:11px;color:#a0a0a8}.tm-grid .edit-line .tm-caption b{font-weight:600;display:inline-block;vertical-align:middle;text-transform:uppercase;letter-spacing:1px;margin-right:6px}.tm-grid .edit-line .tm-caption b.task{color:#191970}.tm-grid .edit-line .tm-caption b.test-case{color:#dd7709}.tm-grid .edit-line .tm-caption .counter{padding:0 6px;border-radius:6px;border:1px solid #c7ccd2;display:inline-block;vertical-align:middle;line-height:12px;margin-right:8px}.tm-grid .edit-line .tm-caption .tau-btn{width:18px;height:18px;position:relative}.tm-grid .edit-line .tm-caption .tau-btn:after{content:"";display:block;width:10px;height:11px;position:absolute;top:2px;left:3px;background-position:-10px -108px}.tm-grid .edit-line .tm-item .view-mode:hover{background-color:#fff}.tm-grid .edit-line .tm-item .view-mode .entity-name{line-height:0;padding:5px 8px}.tm-grid .edit-line .tm-item .view-mode.active .entity-name:hover{cursor:default}.tm-grid .edit-line .tm-item .view-mode .entity-name span{display:inline-block;line-height:normal;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;max-width:100%;border-bottom:dotted 1px #f2f6fb}.tm-grid .edit-line .tm-item .view-mode:hover .entity-name span{border-bottom:dotted 1px #50666b;color:#8596a7}.tm-grid .edit-line .tm-item .edit-block{display:none;padding:0 8px 10px}.tm-grid .edit-line .tm-item .active .edit-block{display:block;margin-bottom:5px}.tm-grid .edit-line .tm-item .active{background-color:#fff}.tm-grid .edit-line .tm-item .active .entity-name{padding:8px}.tm-grid .edit-line .tm-item .active .entity-name span,.tm-grid .edit-line .tm-item .active:hover .entity-name span{background-color:#fff;border:1px solid #cbd1d6;border-top-color:#a3a7ab;padding:2px 7px;min-width:150px;color:#16343b;font-weight:600;display:block;height:18px;line-height:18px}.tm-grid .edit-line .tm-item .active .entity-name.tm-placeholder span{font-weight:400;color:#acb6bf}.tm-grid .edit-line .tm-description{border:1px solid transparent;padding:7px;color:#16343b;display:block;line-height:16px;font-weight:400}.edit-block>.tm-description{min-height:55px}.tm-grid .edit-line .tm-description[contenteditable]{border-color:#a3a7ab #cbd1d6 #cbd1d6;background-color:#fff}.tm-grid .edit-line .note{font-size:11px;color:#acb6bf;padding-top:8px;padding-bottom:2px}.tm-grid .edit-line .action-buttons{padding-top:10px;overflow:hidden}.tm-grid .edit-line .action-buttons .tau-btn.left{float:left}.tm-grid .edit-line .action-buttons .tau-btn.right{float:right}.tm-grid .edit-line input,.tm-grid .edit-line textarea,.tm-grid .tm-name input{width:100%;box-sizing:border-box;font-size:13px;margin:0}.tm-grid .tm-name-edit{width:100%}.tm-stepeditor table{width:100%;table-layout:fixed}.tm-stepeditor td{width:50%;padding:2px 3px;background:#fff;border-top:1px solid #e8e8e8;text-overflow:ellipsis;overflow:hidden}.tm-stepeditor .tm-stepeditor__row:hover td{background:#FFFFE0}.tm-stepeditor .tm-stepeditor__inner-dragging .tm-stepeditor__row:hover td{background:#fff}.tm-stepeditor__row-dragging td{opacity:.1}.tm-stepeditor__row-dragging{max-height:50px;overflow:hidden}',""])},function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var i=this[e];i[2]?t.push("@media "+i[2]+"{"+i[1]+"}"):t.push(i[1])}return t.join("")},t.i=function(e,i){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},a=0;a<this.length;a++){var s=this[a][0];"number"==typeof s&&(n[s]=!0)}for(a=0;a<e.length;a++){var r=e[a];"number"==typeof r[0]&&n[r[0]]||(i&&!r[2]?r[2]=i:i&&(r[2]="("+r[2]+") and ("+i+")"),t.push(r))}},t}},function(t,e,i){function n(t,e){for(var i=0;i<t.length;i++){var n=t[i],a=l[n.id];if(a){a.refs++;for(var s=0;s<a.parts.length;s++)a.parts[s](n.parts[s]);for(;s<n.parts.length;s++)a.parts.push(o(n.parts[s],e))}else{for(var r=[],s=0;s<n.parts.length;s++)r.push(o(n.parts[s],e));l[n.id]={id:n.id,refs:1,parts:r}}}}function a(t){for(var e=[],i={},n=0;n<t.length;n++){var a=t[n],s=a[0],r=a[1],o=a[2],d=a[3],p={css:r,media:o,sourceMap:d};i[s]?i[s].parts.push(p):e.push(i[s]={id:s,parts:[p]})}return e}function s(){var t=document.createElement("style"),e=h();return t.type="text/css",e.appendChild(t),t}function r(){var t=document.createElement("link"),e=h();return t.rel="stylesheet",e.appendChild(t),t}function o(t,e){var i,n,a;if(e.singleton){var o=g++;i=f||(f=s()),n=d.bind(null,i,o,!1),a=d.bind(null,i,o,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(i=r(),n=c.bind(null,i),a=function(){i.parentNode.removeChild(i),i.href&&URL.revokeObjectURL(i.href)}):(i=s(),n=p.bind(null,i),a=function(){i.parentNode.removeChild(i)});return n(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;n(t=e)}else a()}}function d(t,e,i,n){var a=i?"":n.css;if(t.styleSheet)t.styleSheet.cssText=v(e,a);else{var s=document.createTextNode(a),r=t.childNodes;r[e]&&t.removeChild(r[e]),r.length?t.insertBefore(s,r[e]):t.appendChild(s)}}function p(t,e){var i=e.css,n=e.media;e.sourceMap;if(n&&t.setAttribute("media",n),t.styleSheet)t.styleSheet.cssText=i;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(i))}}function c(t,e){var i=e.css,n=(e.media,e.sourceMap);n&&(i+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */");var a=new Blob([i],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}var l={},u=function(t){var e;return function(){return"undefined"==typeof e&&(e=t.apply(this,arguments)),e}},m=u(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
}),h=u(function(){return document.head||document.getElementsByTagName("head")[0]}),f=null,g=0;t.exports=function(t,e){e=e||{},"undefined"==typeof e.singleton&&(e.singleton=m());var i=a(t);return n(i,e),function(t){for(var s=[],r=0;r<i.length;r++){var o=i[r],d=l[o.id];d.refs--,s.push(d)}if(t){var p=a(t);n(p,e)}for(var r=0;r<s.length;r++){var d=s[r];if(0===d.refs){for(var c=0;c<d.parts.length;c++)d.parts[c]();delete l[d.id]}}}};var v=function(){var t=[];return function(e,i){return t[e]=i,t.filter(Boolean).join("\n")}}()},function(t,e){t.exports=o},function(t,e){t.exports=d},function(t,e){t.exports=p},function(t,e){t.exports=c},function(t,e){t.exports=l},function(t,e){t.exports=u},function(t,e){t.exports=m},function(t,e){t.exports=h},function(t,e){t.exports=f},function(t,e){t.exports=g},function(t,e){t.exports=v},function(t,e){t.exports=b},function(t,e){t.exports=x},function(t,e){t.exports=y},function(t,e){t.exports=E},function(t,e){t.exports=k},function(t,e){t.exports=T}])})}();