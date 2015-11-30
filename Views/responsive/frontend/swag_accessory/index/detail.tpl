{block name=frontend_detail_accessory_main_block}
<div class="accessoryContainer">
    {foreach from=$sArticle.sAccessories item=sAccessory}
        {* Group name *}
        {block name=frontend_detail_accessory_header}
            <h2 class="accessoryContainer--headingbox">{$sAccessory.name}</h2>
        {/block}
        {block name=frontend_detail_accessory_group}
            <div class="accessoryContainer--accessory_group">
                {* Group description *}
                {block name=frontend_detail_accessory_goupdescription}
                    <p class="accessory_group--groupdescription">
                        {$sAccessory.description}
                    </p>
                {/block}
                {foreach from=$sAccessory.childs item=sAccessoryChild}
                    {include file="frontend/swag_accessory/index/accessory_product_detail.tpl"}
                {/foreach}
            </div>
        {/block}
    {/foreach}
</div>
<div class="doublespace">&nbsp;</div>
{/block}