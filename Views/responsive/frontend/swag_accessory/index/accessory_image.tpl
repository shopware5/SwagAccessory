<a href="{$sAccessoryChild.sArticle.linkDetails|rewrite:$sAccessoryChild.sArticle.articleName}"
   title="{$sAccessoryChild.sArticle.articleName|escape}"
   class="image--image">
    {block name='frontend_listing_box_article_image_element'}
        <span class="image--element">
            {if isset($sAccessoryChild.sArticle.image.thumbnails)}
                {block name='frontend_listing_box_article_image_picture_element'}
                    <img srcset="{$sAccessoryChild.sArticle.image.thumbnails[0].sourceSet}"
                         alt="{$sAccessoryChild.sArticle.articleName|escape}"
                         title="{$sAccessoryChild.sArticle.articleName|escape|truncate:25:""}" />
                {/block}
            {else}
                <img src="{link file='frontend/_public/src/img/no-picture.jpg'}"
                     alt="{$sAccessoryChild.sArticle.articleName|escape}"
                     title="{$sAccessoryChild.sArticle.articleName|escape|truncate:25:""}" />
            {/if}
        </span>
    {/block}
</a>