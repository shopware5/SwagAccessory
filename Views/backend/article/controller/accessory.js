/**
 * Shopware 4.0
 * Copyright © 2012 shopware AG
 *
 * According to our dual licensing model, this program can be used either
 * under the terms of the GNU Affero General Public License, version 3,
 * or under a proprietary license.
 *
 * The texts of the GNU Affero General Public License with an additional
 * permission and of our proprietary license can be found at and
 * in the LICENSE file you have received along with this program.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * "Shopware" is a registered trademark of shopware AG.
 * The licensing of the program under the AGPLv3 does not imply a
 * trademark license. Therefore any rights, title and interest in
 * our trademarks remain entirely with us.
 */

/**
 * Shopware Backend Accessory Controller
 *
 * Controlls every user-action in the accessory-tab
 */
//{namespace name="backend/accessory/article/view/main"}
//{block name="backend/article/controller/accessory"}
Ext.define('Shopware.apps.Article.controller.Accessory', {

    /**
     * Extend from the standard ExtJS 4
     * @string
     */
    extend: 'Ext.app.Controller',

    refs: [
        { ref: 'groupDetailWindow', selector: 'accessory-main-group-detail' },
        { ref: 'accessoryDetailWindow', selector: 'accessory-main-accessory-detail' },
        { ref: 'saveGroupButton', selector: 'article-detail-window button[action=saveGroup]' },
        { ref: 'groupFormPanel', selector: 'accessory-main-group-detail form[name=accessory-form-panel]' },
        { ref: 'accessoryFormPanel', selector: 'accessory-main-accessory-detail form[name=accessory-article-form-panel]' },
        { ref: 'leftGrid', selector: 'article-detail-window swag_accessory-left-grid' },
        { ref: 'rightGrid', selector: 'article-detail-window swag_accessory-right-grid' },
        { ref: 'groupTextField', selector: 'article-detail-window swag_accessory-left-grid textfield[name=createAccessoryGroup]'}
    ],

    snippets: {
        accessoryTitle: '{s name=title}Accessory{/s}',
        accessoryErrorTitle: '{s name=error_title}An error has occurred{/s}',
        accessorySuccessEditTitle: '{s name=success/edit_title}Edit successful{/s}',
        accessorySuccessEditArticleMessage: '{s name=success/edit_article/message}The article was successfully edited{/s}',
        accessorySuccessEditGroupMessage: '{s name=success/edit_group/message}The group was successfully edited{/s}',
        accessoryDeleteMultipleArticlesMessage: '{s name=delete_multiple_articles/message}You have marked [0] accessory-articles. Are you sure you want to delete them?{/s}',
        accessoryDeleteMultipleArticlesTitle: '{s name=delete_multiple_articles/title}Delete accessory-articles{/s}',
        accessoryDeleteSingleGroupMessage: '{s name=delete_single_group/message}Do you really want to delete the group <b>[0]</b>?{/s}',
        accessoryDeleteSingleGroupTitle: '{s name=delete_single_group/title}Delete group{/s}',
        accessoryDeleteMultipleGroupsMessage: '{s name=delete_multiple_groups/message}You have marked [0] groups. Are you sure you want to delete them?{/s}',
        accessoryDeleteMultipleGroupsTitle: '{s name=delete_multiple_groups/title}Delete groups{/s}',
        accessorySuccessDeleteMultipleGroupsTitle: '{s name=success/delete_multiple_groups/title}Groups deleted{/s}',
        accessorySuccessDeleteMultipleGroupsMessage: '{s name=success/delete_multiple_groups/message}The groups were successfully deleted{/s}',
        accessorySuccessCreateGroupTitle: '{s name=success/create_group/title}Group created{/s}',
        accessorySuccessCreateGroupMessage: '{s name=success/create_group/message}The group was successfully created{/s}',
        accessorySuccessDeleteSingleGroupTitle: '{s name=success/delete_single_group/title}Group deleted{/s}',
        accessorySuccessDeleteSingleGroupMessage: '{s name=success/delete_single_group/message}The group was successfully deleted{/s}',
        accessorySuccessDeleteMultipleArticlesTitle: '{s name=success/delete_multiple_articles/title}Articles deleted{/s}',
        accessorySuccessDeleteMultipleArticlesMessage: '{s name=success/delete_multiple_articles/message}The articles were successfully deleted{/s}',
        accessorySuccessDeleteSingleArticleTitle: '{s name=success/delete_single_article/title}Article deleted{/s}',
        accessorySuccessDeleteSingleArticleMessage: '{s name=success/delete_single_article/message}The article was successfully deleted{/s}'
    },

    /**
     * A template method that is called when your application boots.
     * It is called before the Application's launch function is executed
     * so gives a hook point to run any code before your Viewport is created.
     */
    init: function() {
        var me = this;

        me.control({
            'article-detail-window': {
                accessoryTabActivated: me.onAccessoryTabActivated,
                accessoryStoreReloadNeeded: me.onAccessoryStoreReloadNeeded
            },
            'article-detail-window swag_accessory-left-grid button[action=addGroup]': {
                click: me.onAddGroup
            },
            'swag_accessory-left-grid':{
                itemclick: me.onGridRowClick,
                itemdblclick: me.onOpenEditGroupWindow,
                createGroup: me.onAddGroup,
                editRow: me.onOpenEditGroupWindow,
                deleteRow: me.handleAccessoryGroupDeletion,
                deleteMultipleAccessoryGroups: me.onDeleteMultipleGroups
            },
            'swag_accessory-right-grid': {
                itemdblclick: me.openEditAccessoryArticleWindow,
                articleNumberSelect: me.onArticleNumberSelect,
                removeArticle: me.handleArticleAccessoryDeletion,
                deleteMultipleAccessoryArticles: me.onDeleteMultipleAccessoryArticles,
                editArticle: me.openEditAccessoryArticleWindow
            },
            'accessory-main-group-detail button[action=saveGroup]':{
                click: me.onSaveEdit
            },
            'accessory-main-accessory-detail button[action=saveAccessoryArticle]':{
                click: me.saveOptionName
            }
        });
    },

    /**
     * Callback function triggered when the accessory stores need to be reloaded
     * Will reload leftStore (groups) and clear rightStore (articles)
     */
    onAccessoryStoreReloadNeeded: function() {
        var me = this,
            leftGrid = me.getLeftGrid(),
            rightGrid = me.getRightGrid(),
            leftStore = leftGrid.getStore(),
            rightStore = rightGrid.getStore();

        leftStore.load();
        rightStore.removeAll();
    },

    /**
     * Method to load the accessory-store, when the accessory-tab is clicked.
     * @param accessoryStore
     */
    onAccessoryTabActivated: function(accessoryStore){
        var me = this;
        accessoryStore.load();
        me.getLeftGrid().reconfigure(accessoryStore);
    },

    /**
     * Function to open a new window to enter an accessory-article-name
     * @param grid Contains the right grid
     * @param view Contains the view
     * @param btn Contains the clicked button
     * @param rowIndex The rowIndex of the clicked row
     */
    openEditAccessoryArticleWindow: function(grid, view, btn, rowIndex){
        var me = this,
            selection = grid.getStore().getAt(rowIndex);

        Ext.create('Shopware.apps.Article.view.accessory.detail.AccessoryDetail', { record : selection, mainStore : grid.getStore(), subApp: me.subApplication });
    },

    /**
     * Function to save the new accessory-article-name, if one is set.
     * It also locally sets the new name and reloads the store to display the new name in the grid without reloading it via ajax.
     */
    saveOptionName: function(){
        var me = this,
            form = me.getAccessoryFormPanel(),
            values = form.getValues(),
            mergedValues = Ext.Object.merge(form.getRecord().data, values);

        var model = Ext.create("Shopware.apps.Article.model.accessory.Article", mergedValues);

        model.save({
            callback: function(data, operation){
                var records = operation.getRecords(),
                    record = records[0],
                    rawData = record.getProxy().getReader().rawData,
                    rightGrid = me.getRightGrid();

                if(operation.success){
                    Shopware.Notification.createGrowlMessage(me.snippets.accessorySuccessEditTitle, me.snippets.accessorySuccessEditArticleMessage, me.snippets.accessoryTitle);
                }else{
                    Shopware.Notification.createGrowlMessage(me.snippets.accessoryErrorTitle, rawData.errorMsg, me.snippets.accessoryTitle);
                }
                var win = me.getAccessoryDetailWindow();
                if (win) {
                    win.close();
                }

                var optionName = mergedValues["optionname"];
                form.getRecord().set('optionname', optionName);
                //Needed to reload the store
                rightGrid.reconfigure(rightGrid.store);

            }
        })
    },

    /**
     * Handles the deletion of the accessory-articles.
     * This function is needed to divide the deletion in "multiple articles selected" and "one article selected",
     * because those are handled differently.
     * @param selections
     */
    handleArticleAccessoryDeletion: function(selections){
        var me = this;

        if(selections.length){
            if(selections.length > 1){
                me.onDeleteMultipleAccessoryArticles(selections);
            }else{
                me.onRemoveArticle(selections[0])
            }
        }
    },

    /**
     * Function to delete multiple accessory-articles.
     * It removes each article and also removes the red triangle, which appears when changes are made.
     * Additionally it lowers the count of the group.
     * @param selections Contains all selected articles
     */
    onDeleteMultipleAccessoryArticles: function(selections){
        var me = this,
            leftGrid = me.getLeftGrid(),
            message = Ext.String.format(me.snippets.accessoryDeleteMultipleArticlesMessage, selections.length),
            group = leftGrid.getStore().getById(selections[0].get('shopware.apps.article.model.accessory.group_id'));

        Ext.MessageBox.confirm(me.snippets.accessoryDeleteMultipleArticlesTitle, message, function (response){
            //If the user doesn't want to delete the articles
            if (response !== 'yes')
            {
                return false;
            }

            Ext.each(selections, function(selection){
                selection.destroy({
                    callback: function(data, operation){
                        var records = operation.getRecords(),
                                record = records[0],
                                rawData = record.getProxy().getReader().rawData;
                        if(operation.success){
                            Shopware.Notification.createGrowlMessage(me.snippets.accessorySuccessDeleteMultipleArticlesTitle, me.snippets.accessorySuccessDeleteMultipleArticlesMessage, me.snippets.accessoryTitle);
                            //Directly remove the article instead of reloading the whole grid
                            group.getArticlesStore.remove(selection);
                            group.set('count', group.get('count')-1);

                            // Needed to remove the red triangle
                            group.commit();
                        }else{
                            Shopware.Notification.createGrowlMessage(me.snippets.accessoryErrorTitle, rawData.errorMsg, me.snippets.accessoryTitle);
                        }
                    }
                });
            });
        });
    },

    /**
     * Function to open the edit window, which is needed to set a group-description.
     * @param grid Contains the left grid
     * @param view Contains the view
     * @param btn Contains the clicked button
     * @param rowIndex Contains the row-index
     */
    onOpenEditGroupWindow: function(grid, view, btn, rowIndex){
        var me = this,
            selection = grid.getStore().getAt(rowIndex);

        Ext.create('Shopware.apps.Article.view.accessory.detail.GroupDetail', { record : selection, mainStore : grid.getStore(), subApp: me.subApplication });
    },

    /**
     * Function to remove a single accessory-article
     * @param selection Contains the single article
     */
    onRemoveArticle: function(selection){
        var me = this,
            leftGrid = me.getLeftGrid();

        var group = leftGrid.getStore().getById(selection.get('shopware.apps.article.model.accessory.group_id'));
        group.getArticlesStore.remove(selection);
        selection.destroy({
            callback: function(data, operation){
                var records = operation.getRecords(),
                        record = records[0],
                        rawData = record.getProxy().getReader().rawData;
                if(operation.success){
                    group.set('count', group.get('count')-1);

                    //Needed to remove the red triangle
                    group.commit();

                    Shopware.Notification.createGrowlMessage(me.snippets.accessorySuccessDeleteSingleArticleTitle, me.snippets.accessorySuccessDeleteSingleArticleMessage, me.snippets.accessoryTitle);
                }else{
                    Shopware.Notification.createGrowlMessage(me.snippets.accessoryErrorTitle, rawData.errorMsg, me.snippets.accessoryTitle);
                }
            }
        });

    },

    /**
     * Function to save the changes made to a group.
     * For example you can add a group-description
     * @param button Contains the clicked button
     */
    onSaveEdit: function(button){
        var me = this,
            form = me.getGroupFormPanel(),
            values = form.getValues(),
            data = Ext.Object.merge(form.getRecord().data, values);

        var model = Ext.create("Shopware.apps.Article.model.accessory.Group", data);
        model.save({
            callback: function(data, operation){
                var records = operation.getRecords(),
                        record = records[0],
                        rawData = record.getProxy().getReader().rawData;
                if(operation.success){
                    Shopware.Notification.createGrowlMessage(me.snippets.accessorySuccessEditTitle, me.snippets.accessorySuccessEditGroupMessage, me.snippets.accessoryTitle);
                }else{
                    Shopware.Notification.createGrowlMessage(me.snippets.accessoryErrorTitle, rawData.errorMsg, me.snippets.accessoryTitle);
                }
                var win = me.getGroupDetailWindow();
                if (win) {
                    win.close();
                }
                form.getRecord().store.load();
            }
        })
    },

    /**
     * Handles the deletion of the accessory-groups.
     * This is needed to divide the deletion in "one group selected" and "multiple groups selected".
     * Multiple groups are deleted with an other message-box than a single group
     * @param selections Contains the selected groups
     */
    handleAccessoryGroupDeletion: function(selections){
        var me = this;

        if(selections.length){
            if(selections.length > 1){
                me.onDeleteMultipleGroups(selections);
            }else{
                me.onDeleteSingleGroup(selections[0])
            }
        }
    },

    /**
     * Function to delete a single group.
     * It just deletes the group if the user accepts the message-box.
     * @param selection Contains a single group
     */
    onDeleteSingleGroup: function(selection){
        var me = this,
            message = Ext.String.format(me.snippets.accessoryDeleteSingleGroupMessage, selection.get('name'));

        //Create a message-box, which has to be confirmed by the user
        Ext.MessageBox.confirm(me.snippets.accessoryDeleteSingleGroupTitle, message, function (response){
            //If the user doesn't want to delete the article
            if(response != 'yes')
            {
                return false;
            }
            selection.destroy({
                callback: function(batch, operation){
                    var rawData = batch.proxy.getReader().rawData;
                    if (rawData.success) {
                        Shopware.Notification.createGrowlMessage(me.snippets.accessorySuccessDeleteSingleGroupTitle, me.snippets.accessorySuccessDeleteSingleGroupMessage, me.snippets.accessoryTitle);

                        me.getLeftGrid().getStore().load();
                        me.getRightGrid().getStore().removeAll();
                    }else{
                        Shopware.Notification.createGrowlMessage(me.snippets.accessoryErrorTitle, rawData.errorMsg, me.snippets.accessoryTitle);
                    }
                }
            });
        });
    },

    /**
     * Function, which is fired when the user clicks on an article-suggestion of the Articlesearch-Component
     * @param value Contains the value(name) of the selected article
     * @param hiddenValue Contains the hidden-value(ordernumber) of the selected article
     */
    onArticleNumberSelect: function(value, hiddenValue) {
        var me = this,
            rightGrid = me.getRightGrid(),
            leftGrid = me.getLeftGrid(),
            searchField = rightGrid.articleSearch.items.getAt(1);

        //Reset the search-field after the user clicked on a suggestion, so entering a new term is faster
        searchField.reset();
        var match = rightGrid.getStore().findBy(function(articleModel, id){
            if(articleModel.get("ordernumber") == hiddenValue){
                return true;
            }
        });

        //Checks if the clicked article is already in the group
        if(match == -1){
            var model = Ext.create("Shopware.apps.Article.model.accessory.Article");
            model.set('name', value);
            model.set('ordernumber', hiddenValue);
            model.set('accessory_group_id', rightGrid.activeGroupId);
            rightGrid.getStore().add(model);

            var group = leftGrid.getStore().getById(rightGrid.getStore().data.getAt(0).get('shopware.apps.article.model.accessory.group_id'));

            group.save({
                success: function(batch){
                    var rawData = batch.proxy.getReader().rawData;
                    model.set('id', rawData["lastInsert"]);
                    group.set('count', group.get('count')+1);

                    //Remove red triangles
                    model.commit();
                    group.commit();
                }
            })
        }

    },

    /**
     * Fired when the user clicks on a group in the left grid.
     * This is needed to display the associated articles in the right grid then.
     * @param view Contains the view
     * @param record Contains the clicked record
     */
    onGridRowClick: function(view, record){
        var me = this,
            rightGrid = me.getRightGrid();

        //Needed to set the groupId to a new article
        rightGrid.activeGroupId = record.get('id');

        //The search is disabled first
        rightGrid.articleSearch.items.getAt(1).enable();

        //Sets a new store
        rightGrid.reconfigure(record.getArticlesStore);
    },

    /**
     * Function to delete multiple groups.
     * It displays a message-box and then removes each group.
     * @param selections Contains all selected groups
     */
    onDeleteMultipleGroups: function(selections){
        var me = this,
            message = Ext.String.format(me.snippets.accessoryDeleteMultipleGroupsMessage, selections.length),
            store = me.getLeftGrid().getStore();

        //Create a message-box, which has to be confirmed by the user
        Ext.MessageBox.confirm(me.snippets.accessoryDeleteMultipleGroupsTitle, message, function (response){
            //If the user doesn't want to delete the articles
            if (response !== 'yes')
            {
                return false;
            }

            Ext.each(selections, function(item){
                store.remove(item);
            });
            store.sync({
                callback: function(batch, operation) {
                    var rawData = batch.proxy.getReader().rawData;
                    if (rawData.success) {
                        Shopware.Notification.createGrowlMessage(me.snippets.accessorySuccessDeleteMultipleGroupsTitle, me.snippets.accessorySuccessDeleteMultipleGroupsMessage, me.snippets.accessoryTitle);

                        me.getRightGrid().getStore().removeAll();

                    }else{
                        Shopware.Notification.createGrowlMessage(me.snippets.accessoryErrorTitle, rawData.errorMsg, me.snippets.accessoryTitle);
                    }
                }
            })
        });
    },

    /**
     * Function to add a new group.
     * @param btn Contains the clicked button
     */
    onAddGroup: function(btn){
        var me = this,
            textField = me.getGroupTextField(),
            leftGrid = me.getLeftGrid();

        if(textField.value == ""){
            return;
        }
        var model = Ext.create("Shopware.apps.Article.model.accessory.Group");
        model.set('name', textField.value);
        model.set('article_id', me.subApplication.article.get('id'));
        textField.setValue("");
        model.save({
            callback: function(data, operation){
                var records = operation.getRecords(),
                        record = records[0],
                        rawData = record.getProxy().getReader().rawData;
                if(operation.success){
                    Shopware.Notification.createGrowlMessage(me.snippets.accessorySuccessCreateGroupTitle, me.snippets.accessorySuccessCreateGroupMessage, me.snippets.accessoryTitle);
                }else{
                    Shopware.Notification.createGrowlMessage(me.snippets.accessoryErrorTitle, rawData.errorMsg, me.snippets.accessoryTitle);
                }
                leftGrid.getStore().load();
            }
        });
    }
});
//{/block}