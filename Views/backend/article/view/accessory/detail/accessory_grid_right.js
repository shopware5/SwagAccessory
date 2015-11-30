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
 * Shopware View Accessory-Grid Right
 *
 * This is the right grid of the accessory-tab.
 * It contains all associated accessory-articles.
 */
//{namespace name="backend/accessory/article/view/main"}
//{block name="backend/article/view/accessory/detail/accessory_grid_right"}
Ext.define('Shopware.apps.Article.view.accessory.detail.AccessoryGridRight', {
    extend:'Ext.grid.Panel',

    /**
     * List of short aliases for class names. Most useful for defining xtypes for widgets.
     * @string
     */
    alias:'widget.swag_accessory-right-grid',
    region: 'east',
    flex: 1,

    plugins: [{
        ptype: 'gridtranslation',
        translationType: 'accessoryoption'
    }],

    snippets: {
        accessoryArticlesEditButton: '{s name=accessory_articles/edit_button}Edit article{/s}',
        accessoryDeleteSingleArticleButton: '{s name=accessory_articles/delete_button}Delete article{/s}',
        accessoryArticlesColumnArticleName: '{s name=accessory_articles/column/article_name}Article-name{/s}',
        accessoryArticlesColumnOptionName: '{s name=accessory_articles/column/option_name}Option-name{/s}',
        accessoryArticlesToolBarLabel: '{s name=accessory_articles/toolBar/label}Add article{/s}',
        accessoryArticlesToolBarDeleteButton: '{s name=accessory_articles/toolBar/delete_button}Delete multiple articles{/s}',
        accessoryActionColumn: '{s name=actioncolumn}Action(s){/s}'
    },

    /**
     * The initComponent template method is an important initialization step for a Component.
     * It is intended to be implemented by each subclass of Ext.Component to provide any needed constructor logic.
     * The initComponent method of the class being created is called first,
     * with each initComponent method up the hierarchy to Ext.Component being called thereafter.
     * This makes it easy to implement and, if needed, override the constructor logic of the Component at any step in the hierarchy.
     * The initComponent method must contain a call to callParent in order to ensure that the parent class' initComponent method is also called.
     *
     * @return void
     */
    initComponent:function () {
        var me = this;

        me.registerEvents();

        me.columns = me.createColumns();
        me.selModel = me.getGridSelModel();

        me.dockedItems = [];
        me.toolBar = me.createToolBar();
        me.dockedItems.push(me.toolBar);

        me.callParent(arguments);
    },

    /**
     * This function is an override of the afterRender-function.
     * It is needed to add the keyboard-events after everything is rendered.
     */
    afterRender: function(){
        var me = this;

        me.callParent(arguments);

        me.addKeyboardEvent();
    },

    /*
     * Creates the selectionModel of the grid with a listener to enable the delete-button
     */
    getGridSelModel: function(){
        var selModel = Ext.create('Ext.selection.CheckboxModel',{
            listeners: {
                selectionchange: function(sm, selections){
                    var owner = this.view.ownerCt,
                            btn = owner.down('button[action=deleteMultipleAccessoryArticles]');

                    //If no group is marked
                    if(btn){
                        btn.setDisabled(selections.length == 0);
                    }
                }
            }
        });

        return selModel;
    },

    /**
     * Function to add the keyboard-event "DEL"
     */
    addKeyboardEvent: function() {
        var me = this, map;

        map = new Ext.util.KeyMap(me.getEl(), [
            {
                //DELETE-Key
                key: 46,
                ctrl: false,
                alt: false,
                fn: function() {
                    var selection = me.getSelectionModel().getSelection();
                    me.fireEvent('removeArticle', selection);
                }
            }
        ]);
    },

    /**
     *  Function to register all events, which are used in this grid
     */
    registerEvents: function(){
        this.addEvents(
            /**
             * This event is fired, when the user clicks on a suggestion of the articleSearch-component.
             *
             * @event articleNumberSelect
             * @param [string] value - Contains the name of the clicked article
             * @param [string] hiddenValue - Contains the ordernumber of the clicked article
             * @param [object] record - Contains the article-model
             * @param [object] field - Ext.form.field.Text
             */
            'articleNumberSelect',

            /**
             * This event is fired when the user wants to delete an accessory-article
             *
             * @param array record - Contains the selected article
             */
            'removeArticle',

            /**
             * This event is fired when the user wants to delete multiple accessory-articles
             *
             * @param array - Contains all selected groups
             */
            'deleteMultipleAccessoryArticles',

            /**
             * This event is fired, when the user wants to edit an article
             *
             * @event editRow
             * @param [object] me - Ext.grid.Panel
             * @param [object] view - Ext.grid.View
             * @param [object] item - Ext.button.Button
             * @param int rowIndex - Contains the row-index of the clicked button
             * @param int colIndex - Contains the col-index of the clicked button
             */
            'editArticle'
        );
    },

    /**
     * This function creates the columns and the button of the actioncolumn
     * @return array columns - Contains all columns
     */
    createColumns: function(){
        var me = this,
            buttons = [];

        buttons.push(Ext.create('Ext.button.Button', {
            iconCls: 'sprite-pencil',
            cls: 'editBtn',
            tooltip: me.snippets.accessoryArticlesEditButton,
            handler:function (view, rowIndex, colIndex, item) {
                me.fireEvent('editArticle', me, view, item, rowIndex, colIndex);
            }
        }));
        buttons.push(Ext.create('Ext.button.Button', {
            iconCls: 'sprite-minus-circle',
            action: 'delete',
            cls: 'delete',
            tooltip: me.snippets.accessoryDeleteSingleArticleButton,
            handler:function (view, rowIndex, colIndex, item, opts, record) {
                me.fireEvent('removeArticle', [ record ] );
            }
        }));

        var columns = [
            {
                header: me.snippets.accessoryArticlesColumnArticleName,
                dataIndex: 'name',
                flex: 1
            }, {
                header: me.snippets.accessoryArticlesColumnOptionName,
                dataIndex: 'optionname',
                flex: 1,
                translationEditor: {
                    xtype: 'textfield',
                    allowBlank: false,
                    fieldLabel: me.snippets.accessoryArticlesColumnOptionName,
                    name: 'optionname'
                }
            }, {
                xtype: 'actioncolumn',
                width: 60,
                items: buttons,
                header: me.snippets.accessoryActionColumn
            }
        ];

        return columns;
    },

    /**
     * Function to create the toolbar with the buttons and a textfield.
     * @return [object] toolBar - Ext.toolbar.Toolbar
     */
    createToolBar: function(){
        var me = this;

        me.articleSearch = Ext.create('Shopware.form.field.ArticleSearch', {
            name: 'articleSearch',
            fieldLabel: me.snippets.accessoryArticlesToolBarLabel,
            formFieldConfig: {
                labelWidth: 125,
                margin: '2 0 0'
            }
        });
        me.articleSearch.items.getAt(1).disable();

        me.articleSearch.on('valueselect', function(field, value, hiddenValue, record) {
            me.fireEvent('articleNumberSelect', value, hiddenValue, record, field)
        });
        var toolBar = Ext.create('Ext.toolbar.Toolbar', {
            dock: 'top',
            ui: 'shopware-ui',
            items: [
                me.articleSearch,
                {
                    xtype: 'button',
                    iconCls: 'sprite-minus-circle',
                    action: 'deleteMultipleAccessoryArticles',
                    text: me.snippets.accessoryArticlesToolBarDeleteButton,
                    disabled: true,
                    handler: function(){
                        me.fireEvent('deleteMultipleAccessoryArticles', me.selModel.getSelection());
                    }
                }
            ]
        });

        return toolBar;
    }
});
//{/block}