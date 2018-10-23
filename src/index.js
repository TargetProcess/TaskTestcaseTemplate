/* globals mashup */
import {when, Deferred} from 'jquery';
import {noop, property, has} from 'underscore';
import React from 'react';
import view from 'tp/userStory/view';
import configurator from 'tau/configurator';
import TemplatesManager from './screens/TemplatesManager';
import'./style.css';

const waitForAppConfigurator = () => {
    let appConfiguratorIsResolved = false;
    const appConfiguratorDef = new Deferred();

    /* eslint-disable no-unused-vars */
    configurator.getGlobalBus().on('configurator.ready', (e, appConfigurator) => {
        /* eslint-enable no-unused-vars */

        /* eslint-disable no-underscore-dangle */
        if (!appConfiguratorIsResolved && !appConfigurator._id.match(/global/)) {
            /* eslint-enable no-underscore-dangle */
            appConfiguratorIsResolved = true;
            appConfiguratorDef.resolve(appConfigurator);
        }
    });

    return () => appConfiguratorDef.promise();
};

const getAppConfigurator = waitForAppConfigurator();

const getProject = (entity) =>
    getAppConfigurator()
        .then(appConfigurator => appConfigurator.getStore2()
            .find(`${entity.entityType.name}\\${entity.id}?select={project:{project.id}}`))
        .then(response => response.length && response[0].project || null);

const isTabEnabled = (entity, mashupConfig) => {
    const {showOnProjects} = mashupConfig;

    if (!showOnProjects) {
        return true;
    }

    const isInProjectsToShow = (project) => showOnProjects.indexOf(project.id) >= 0;

    if (!showOnProjects.length) {
        return false;
    }

    if (has(entity, 'projectId')) {
        return isInProjectsToShow({id: entity.projectId});
    }

    return getProject(entity)
        .then((project) => Boolean(project) && isInProjectsToShow(project))
        .fail(() => false);
};

const createTabContent = (entity, holder, mashupConfig) => {
    when(isTabEnabled(entity, mashupConfig), getAppConfigurator())
        .then((enabled, appConfigurator) => {
            React.render((
                <TemplatesManager
                    configurator={appConfigurator}
                    disabled={!enabled}
                    entity={entity}
                />
            ), holder);
        });
};

const mashupConfig = mashup.config;

// noinspection JSUnusedGlobalSymbols
view.addTab('Template', ($el, {entity}) => createTabContent(entity, $el[0], mashupConfig), noop, {
    getViewIsSuitablePromiseCallback: ({entity}) =>
        when(isTabEnabled(entity, mashupConfig)).promise()
});
