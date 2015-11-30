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
 * This is the detail-window to edit an accessory-article
 */
//{namespace name="backend/accessory/article/view/main"}
//{block name="backend/article/view/accessory/detail/accessory_detail"}
Ext.define('Shopware.apps.Article.view.accessory.detail.AccessoryDetail', {
    extend:'Enlight.app.Window',
    alias:'widget.accessory-main-accessory-detail',
    cls:'createWindow',
    modal: true,

    layout:'border',
    autoShow:true,
    border:0,
    width:270,
    height:120,
    stateful:true,
    stateId:'shopware-accessory-article-detail',
    footerButton: false,

    snippets: {
        accessoryDetailsOptionNameLabel: '{s name=accessory_details/optionname_label}Optionname{/s}',
        accessoryCancelButton: '{s name=cancel_button}Cancel{/s}',
        accessorySaveButton: '{s name=save_button}Save{/s}'
    },

    title: '{s name=accessory_details/title}Accessory-article details{/s}',

    /**
     * This function creates the form-panel and adds a toolbar.
     */
    initComponent:function () {
        var me = this;

        me.accessoryArticleForm = me.createFormPanel();
        me.dockedItems = [{
            xtype: 'toolbar',
            ui: 'shopware-ui',
            dock: 'bottom',
            cls: 'shopware-toolbar',
            items: me.createButtons()
        }];

        me.items = [me.accessoryArticleForm];
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
            name: 'accessory-article-form-panel',
            region:'center',
            defaults: {
                labelWidth: 155,
                labelStyle: 'font-weight: bold'
            },
            bodyPadding:10,
            items:[
                {
                    xtype:'textfield',
                    name:'optionname',
                    fieldLabel: me.snippets.accessoryDetailsOptionNameLabel,
                    allowBlank:true,
                    required: false
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
                text:me.snippets.accessorySaveButton,
                action:'saveAccessoryArticle',
                cls:'primary'
            }
        ];

        return buttons;
    }
});
//{/block}