{block name=frontend_detail_accessory_checkbox}
    <div class="head--checkbox">
        <span class="filter-panel--checkbox">
            <input type="checkbox" class="sValueChanger chkbox" name="sValueChange" id="CHECK{$sAccessoryChild.ordernumber}" value="{$sAccessoryChild.ordernumber}" />
             <span class="checkbox--state">&nbsp;</span>
        </span>

    </div>
    <div class="head--label-content">
        {block name=frontend_detail_accessory_lable}
            <div>
                <label for="CHECK{$sAccessoryChild.ordernumber}">{if $sAccessoryChild.optionname}{$sAccessoryChild.optionname|truncate:35}{else}{$sAccessoryChild.sArticle.articleName|truncate:35}{/if}
                    <br /><span class="label-content-surcharge">{se namespace="frontend/detail/buy" name="DetailBuyLabelSurcharge"}{/se}: {$sAccessoryChild.price|currency:use_symbol}*</span>
                </label>
            </div>
            {if $sAccessoryChild.sArticle.purchaseunit}
                <div class="label-content--purchaseunit">
                    {* Article price *}
                    {block name=frontend_detail_accessory_price}
                        <div class='purchaseunit--price_unit'>
                            {block name=frontend_detail_accessory_price_span}
                                <span class="smaller">
                                    {$sAccessoryChild.sArticle.purchaseunit} {$sAccessoryChild.sArticle.sUnit.description}
                                    {if $sAccessoryChild.sArticle.purchaseunit != $sAccessoryChild.sArticle.referenceunit}
                                        <span class="">
                                            {if $sAccessoryChild.sArticle.referenceunit}
                                                ({$sAccessoryChild.sArticle.referenceprice|currency} {s name="Star" namespace="frontend/listing/box_article"}{/s} / {$sAccessoryChild.sArticle.referenceunit} {$sAccessoryChild.sArticle.sUnit.description})
                                            {/if}
                                        </span>
                                    {/if}
                                </span>
                            {/block}
                        </div>
                    {/block}
                </div>
            {else}
                <div class="accessory-content--accessory-purchaseunit">&nbsp;</div>
            {/if}
        {/block}
    </div>
{/block}