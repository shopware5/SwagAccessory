;(function($) {

    /**
     * The swagAccessory Plugin
     */
    $.plugin('swagAccessory', {

        /**
         * The accessory checkboxes that represents an accessory article.
         */
        checkBoxes: null,

        /**
         * The #sAddAccessories hidden Input Field
         */
        accessories: null,

        /**
         * Initialized the jQuery Plugin
         */
        init: function () {
            var me = this;
            // get all Checkboxes of SwagAccessory
            me.checkBoxes = $("input:checkbox[name='sValueChange']");
            me.accessories = $('#sAddAccessories');
            me.bindEvents();
        },

        /**
         * Bind the change Event to the Checkboxes of
         * SwagAccessory
         */
        bindEvents: function () {
            var me = this;
            // register on all Checkboxes the change EventHandler
            me._on(me.checkBoxes, 'change', $.proxy(me.change, me, me));
        },

        /**
         * The Eventhandler for the Checkboxes
         */
        change: function (thisPlugin) {
            var event = window.event || thisPlugin || event;
            var that = $(event.currentTarget);

            if(that.attr('checked')){
                that.attr('checked', false);
            } else {
                that.attr('checked', 'checked');
            }
            thisPlugin.setValue();
        },

        /**
         * The method checks which Checkbox is checked and set the Value
         * to the #sAddAccessories hidden Input Field
         */
        setValue: function () {
            var me = this;
            // set the #sAddAccessories value to "null"
            me.accessories.val('');
            // get all checked Checkboxes and add the value ';' separated to #sAddAccessories
            $.each($("input:checkbox[name='sValueChange']:checked"), function (key, value) {
                var val = me.accessories.val();
                val += $(value).val() + ';';
                me.accessories.val(val);
            });
        },

        /**
         * Destroys the jQuery Plugin
         */
        destroy: function() {
            var me = this;
            me.checkBoxes = null;
            me.accessories = null;
            me._destroy();
        }
    });

    /**
     * Wait til the document is ready and call the
     * jQuery Plugin
     */
    $(document).ready(function() {
        $('#sAddAccessories').swagAccessory();
    });
})(jQuery);
