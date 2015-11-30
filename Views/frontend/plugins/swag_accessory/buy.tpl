{block name="frontend_index_header_javascript_jquery" append}
<script type="text/javascript">
;(function($) {
    $(document).ready(function() {
        $('.accessory_group input').unbind('change').bind('change', function () {
            var $this = $(this);
            $accessories = $('#sAddAccessories');
            $accessories.val('');
            $('.accessory_group input:checked').each(function (i, el) {
                var val = $accessories.val();
                val += $(el).val() + ';';
                $accessories.val(val);
            });
        });
        var lasthover;
        $('.basketform label').unbind('mouseenter mouseleave').hover(function () {
            var $this = $(this);

            var value = $this.prev('input').val();

            if (value && value.length) {
                value = value.replace('\.', '\\.');
                $('div#DIV' + value).fadeIn('fast');
                lasthover = $('div#DIV'+value);
            }
        }, function () {
            if(!lasthover) {
                return false;
            }
            lasthover.fadeOut('fast');
            lasthover = '';
        });
    });

})(jQuery);
</script>
{/block}

{block name="frontend_index_header_css_screen" append}
    {if $templateVersion > 1}
        <link type="text/css" media="all" rel="stylesheet" href="{link file='frontend/_resources/styles/accessory.css'}" />
    {/if}
{/block}

{block name="frontend_detail_buy_accessories"}
    <div class="accessory_container">
        {foreach from=$sArticle.sAccessories item=sAccessory}
            {* Group name *}
            <h2 class="headingbox">{$sAccessory.name}</h2>
            <div class="accessory_group">
                {* Group description *}
                <p class="groupdescription">
                    {$sAccessory.description}
                </p>
                {foreach from=$sAccessory.childs item=sAccessoryChild}

                    <input type="checkbox" class="sValueChanger chkbox" name="sValueChange" id="CHECK{$sAccessoryChild.ordernumber}" value="{$sAccessoryChild.ordernumber}" />
                    <label for="CHECK{$sAccessoryChild.ordernumber}">{if $sAccessoryChild.optionname}{$sAccessoryChild.optionname|truncate:35}{else}{$sAccessoryChild.sArticle.articleName|truncate:35}{/if}
                        ({se namespace="frontend/detail/buy" name="DetailBuyLabelSurcharge"}{/se}: {$sAccessoryChild.price|currency:use_symbol}*)
                    </label>

                    <div id="DIV{$sAccessoryChild.ordernumber}" class="accessory_overlay">
                        {include file="frontend/detail/accessory.tpl" sArticle=$sAccessoryChild.sArticle}
                    </div>
                    <div class="clear">&nbsp;</div>
                {/foreach}
            </div>
        {/foreach}
    </div>
    <div class="doublespace">&nbsp;</div>
{/block}