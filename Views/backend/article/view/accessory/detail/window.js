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
 * Override for the article-detail-window
 */
//{block name="backend/article/view/detail/window" append}
//{namespace name="backend/accessory/article/view/main"}
Ext.define('Shopware.apps.Article.view.accessory.detail.Window', {

    override: 'Shopware.apps.Article.view.detail.Window',

    /**
     * @Override
     * Creates the main tab panel which displays the different tabs for the article sections.
     * To extend the tab panel this function can be override.
     *
     * @return Ext.tab.Panel
     */
    createMainTabPanel: function () {
        var me = this;

        result = me.callParent(arguments);

        me.registerAdditionalTab({
            title: '{s name=title}Accessory{/s}',
            contentFn: me.createAccessoryTab,
            articleChangeFn: me.articleChangeAccessory,
            tabConfig: {
                layout: 'fit',
                title: "{s name=title}Accessory{/s}",
                listeners: {
                    activate: function() {
                        me.fireEvent('accessoryTabActivated', me.accessoryStore);
                    }
                }
            },
            scope: me
        });

        return result;
    },

    /**
     * Create the accessory tab
     * @param article
     * @param stores
     * @param eOpts
     */
    createAccessoryTab: function(article, stores, eOpts) {
        var me = this,
            tab = eOpts.tab;
            controller = me.subApplication.getController('Accessory');

        me.accessoryStore = Ext.create('Shopware.apps.Article.store.accessory.Groups');
        me.accessoryStore.getProxy().extraParams.articleId = me.article.get('id');

        me.accessoryTab = Ext.create('Ext.container.Container', {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            name: 'accessory',
            cls: Ext.baseCSSPrefix + 'accessory-tab-container',
            items: [
                Ext.create("Shopware.apps.Article.view.accessory.detail.AccessoryGridLeft", {
                    articleId: me.subApplication.article.get('id')
                }),
                Ext.create("Shopware.apps.Article.view.accessory.detail.AccessoryGridRight")
            ]
        });

        tab.add(me.accessoryTab);
        tab.setDisabled(article.get('id') === null)
    },

    /**
     * Callback function called, when the article changed in the splitView
     * @param article
     */
    articleChangeAccessory: function(article) {
        var me = this;

        me.accessoryStore.getProxy().extraParams.articleId = me.article.get('id');

        me.fireEvent('accessoryStoreReloadNeeded');
    }


});
// {/block}}