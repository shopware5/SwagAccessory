{block name=frontend_detail_accessory_accessory_container}
    <div class="box--accessory-content">
        {block name=frontend_detail_accessory_head}
            <div class="accessory-content--head">
                {include file="frontend/swag_accessory/index/accessory_content_header.tpl"}
            </div>
        {/block}
        <div class="accessory-content--content">
            {block name='frontend_detail_accessory_picture'}
                <div class="content--image">
                    {include file="frontend/swag_accessory/index/accessory_image.tpl"}
                </div>
            {/block}
        </div>
    </div>
{/block}