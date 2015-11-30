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
 * Shopware View Accessory-Grid Left
 *
 * This is the left grid of the accessory-tab.
 * It contains all accessory-groups.
 */
//{namespace name="backend/accessory/article/view/main"}
//{block name="backend/article/view/accessory/detail/accessory_grid_left"}
Ext.define('Shopware.apps.Article.view.accessory.detail.AccessoryGridLeft', {
    extend:'Ext.grid.Panel',

    /**
     * List of short aliases for class names. Most useful for defining xtypes for widgets.
     * @string
     */
    alias:'widget.swag_accessory-left-grid',
    region: 'center',
    flex: 1,

    plugins: [{
        ptype: 'gridtranslation',
        translationType: 'accessorygroup'
    }],

    snippets: {
        accessoryGroupsEditButton: '{s name=accessory_groups/edit_button}Edit group{/s}',
        accessoryDeleteSingleGroupButton: '{s name=accessory_groups/delete_button}Delete group{/s}',
        accessoryGroupsColumnName: '{s name=accessory_groups/column/name}Name{/s}',
        accessoryGroupsColumnDescription: '{s name=accessory_groups/column/description}Description{/s}',
        accessoryGroupsColumnCount: '{s name=accessory_groups/column/count}Number of assigned articles{/s}',
        accessoryGroupsToolBarLabel: '{s name=accessory_groups/toolBar/label}Create accessory-group{/s}',
        accessoryGroupsToolBarAddButton: '{s name=accessory_groups/toolBar/add_button}Add group{/s}',
        accessoryGroupsToolBarDeleteButton: '{s name=accessory_groups/toolBar/delete_button}Delete multiple groups{/s}',
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
        me.columns = me.createColumns();

        me.registerEvents();

        me.selModel = me.getGridSelModel();
        me.dockedItems = [];
        me.toolBar = me.createToolBar();
        me.dockedItems.push(me.toolBar);

        me.dockedItems.push({
            dock: 'bottom',
            xtype: 'pagingtoolbar',
            displayInfo: true,
            store: me.store
        });
        me.callParent(arguments);
    },

    /**
     *  Function to register all events, which are used in this grid
     */
    registerEvents: function(){
        this.addEvents(
                /**
                 * This event is fired, when the user enters a group-name in the textfield and clicks on the create-button
                 * or presses "ENTER"
                 *
                 * @event createGroup
                 * @param [object] this - Ext.form.field.Text
                 */
                'createGroup',

                /**
                 * This event is fired, when the user wants to edit a group
                 *
                 * @event editRow
                 * @param [object] me - Ext.grid.Panel
                 * @param [object] view - Ext.grid.View
                 * @param [object] item - Ext.button.Button
                 * @param int rowIndex - Contains the row-index of the clicked button
                 * @param int colIndex - Contains the col-index of the clicked button
                 */
                'editRow',

                /**
                 * This event is fired, when the user wants to delete a single group
                 *
                 * @param array record - Contains a single selection
                 */
                'deleteRow',

                /**
                 * This event is fired, when the user wants to delete multiple groups by clicking on the button in the toolbar
                 *
                 * @param array - Contains all selections
                 */
                'deleteMultipleAccessoryGroups'
        );
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
                    me.fireEvent('deleteRow', selection);
                }
            }
        ]);
    },

    /*
     * Creates the selectionModel of the grid with a listener to enable the delete-button
     */
    getGridSelModel: function(){
        var selModel = Ext.create('Ext.selection.CheckboxModel',{
            listeners: {
                selectionchange: function(sm, selections){
                    var owner = this.view.ownerCt,
                            btn = owner.down('button[action=deleteMultipleGroups]');

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
     * Function to create the columns and the buttons for the action-column
     * @return array columns - Contains all columns
     */
    createColumns: function(){
        var me = this,
            buttons = [];

        buttons.push(Ext.create('Ext.button.Button', {
            iconCls: 'sprite-pencil',
            cls: 'editBtn',
            tooltip: me.snippets.accessoryGroupsEditButton,
            handler:function (view, rowIndex, colIndex, item) {
                me.fireEvent('editRow', me, view, item, rowIndex, colIndex);
            }
        }));

        buttons.push(Ext.create('Ext.button.Button', {
            iconCls: 'sprite-minus-circle',
            action: 'delete',
            cls: 'delete',
            tooltip: me.snippets.accessoryDeleteSingleGroupButton,
            handler:function (view, rowIndex, colIndex, item, opts, record) {
                me.fireEvent('deleteRow', [ record ]);
            }
        }));

        var columns = [
            {
                header: me.snippets.accessoryGroupsColumnName,
                dataIndex: 'name',
                flex: 2,
                translationEditor: {
                    xtype: 'textfield',
                    allowBlank: false,
                    fieldLabel: me.snippets.accessoryGroupsColumnName,
                    name: 'name'
                }
            },{
                header: me.snippets.accessoryGroupsColumnDescription,
                dataIndex: 'description',
                flex: 2,
                translationEditor: {
                    xtype: 'textarea',
                    allowBlank: false,
                    fieldLabel: me.snippets.accessoryGroupsColumnDescription,
                    name: 'description'
                }
            },{
                header: me.snippets.accessoryGroupsColumnCount,
                dataIndex: 'count',
                flex: 2,
                sortable: false
            },
            {
                xtype: 'actioncolumn',
                items: buttons,
                width: 60,
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
        var items = [
            {
                xtype: 'textfield',
                fieldLabel: me.snippets.accessoryGroupsToolBarLabel,
                name: 'createAccessoryGroup',
                labelWidth: 120,
                margin: '0 8 0 0',
                listeners: {
                    specialkey: function(field, event) {
                        if (event.getKey() === event.ENTER) {
                            me.fireEvent('createGroup', this);
                        }
                    }
                }
            }, {
                xtype: 'button',
                iconCls: 'sprite-plus-circle',
                action: 'addGroup',
                text: me.snippets.accessoryGroupsToolBarAddButton
            }, {
                xtype: 'button',
                iconCls: 'sprite-minus-circle',
                action: 'deleteMultipleGroups',
                text: me.snippets.accessoryGroupsToolBarDeleteButton,
                disabled: true,
                handler: function(){
                    me.fireEvent('deleteMultipleAccessoryGroups',me.selModel.getSelection());
                }
            }
        ];
        var toolBar = Ext.create('Ext.toolbar.Toolbar', {
            dock: 'top',
            ui: 'shopware-ui',
            items: items
        });

        return toolBar;
    }
});
//{/block}