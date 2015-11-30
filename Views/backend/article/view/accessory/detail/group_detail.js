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
 * Shopware View Detail
 *
 * This is the detail-window to edit an accessory-group
 */
//{namespace name="backend/accessory/article/view/main"}
//{block name="backend/article/view/accessory/detail/group_detail"}
Ext.define('Shopware.apps.Article.view.accessory.detail.GroupDetail', {
    extend:'Enlight.app.Window',
    alias:'widget.accessory-main-group-detail',
    cls:'createWindow',
    modal: true,

    layout:'border',
    autoShow:true,
    border:0,
    width:600,
    height:220,
    stateful:true,
    stateId:'shopware-accessory-group-detail',
    footerButton: false,

    snippets: {
        groupDetailsNameLabel: '{s name=group_details/name_label}Name{/s}',
        groupDetailsDescriptionLabel: '{s name=group_details/description_label}Description{/s}',
        accessoryCancelButton: '{s name=cancel_button}Cancel{/s}',
        accessorySaveButton: '{s name=save_button}Save{/s}'
    },

    title: '{s name=group_details/title}Group details{/s}',

    /**
     * This function creates the form-panel and adds a toolbar.
     */
    initComponent:function () {
        var me = this;

        me.accessoryForm = me.createFormPanel();
        me.dockedItems = [{
            xtype: 'toolbar',
            ui: 'shopware-ui',
            dock: 'bottom',
            cls: 'shopware-toolbar',
            items: me.createButtons()
        }];

        me.items = [me.accessoryForm];
        me.callParent(arguments);
    },

    /**
     * This function creates the form-panel.
     * If a record is set, it automatically loads the record into the form.
     * @return [object] accessoryForm - Ext.form.Panel
     */
    createFormPanel: function(){
        var me = this;
        var accessoryForm = Ext.create('Ext.form.Panel', {
            collapsible:false,
            split:false,
            name: 'accessory-form-panel',
            region:'center',
            defaults: {
                labelWidth: 155,
                labelStyle: 'font-weight: bold'
            },
            bodyPadding:10,
            items:[
                {
                    xtype:'textfield',
                    name:'name',
                    fieldLabel: me.snippets.groupDetailsNameLabel,
                    allowBlank:false,
                    required: true
                },
                {
                    xtype:'textarea',
                    name:'description',
                    fieldLabel: me.snippets.groupDetailsDescriptionLabel,
                    allowBlank:true
                },
                {
                    xtype: 'hidden',
                    name: 'id'
                }
            ]
        });

        if(me.record){
            accessoryForm.loadRecord(me.record);
        }

        return accessoryForm;
    },

    /**
     * This function creates the buttons to save or cancel the form-panel.
     * @return array buttons - Contains the buttons
     */
    createButtons: function(){
        var me = this;
        var buttons = ['->',
            {
                text: me.snippets.accessoryCancelButton,
                cls: 'secondary',
                scope:me,
                handler:me.destroy
            },
            {
                text: me.snippets.accessorySaveButton,
                action:'saveGroup',
                cls:'primary'
            }
        ];

        return buttons;
    }
});
//{/block}