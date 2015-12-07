<?php
/*
 * (c) shopware AG <info@shopware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

class Shopware_Plugins_Frontend_SwagAccessory_Bootstrap extends Shopware_Components_Plugin_Bootstrap
{
    /**
     * Returns an array with the capabilities of the plugin.
     *
     * @public
     * @return array
     */
    public function getCapabilities()
    {
        return array(
            'install' => true,
            'enable' => true,
            'update' => true
        );
    }

    /**
     * Returns the well-formatted name of the plugin
     * as a sting
     *
     * @public
     * @return string
     */
    public function getLabel()
    {
        return "Zubehör";
    }

    /**
     * Returns the version of the plugin as a string
     *
     * @public
     * @return string
     * @throws Exception
     */
    public function getVersion()
    {
        $info = json_decode(file_get_contents(__DIR__ . DIRECTORY_SEPARATOR . 'plugin.json'), true);

        if ($info) {
            return $info['currentVersion'];
        } else {
            throw new Exception('The plugin has an invalid version file.');
        }
    }

    /**
     * Returns the meta information about the plugin
     * as an array.
     * Keep in mind that the plugin description located
     * in the info.txt.
     *
     * @public
     * @return array
     */
    public function getInfo()
    {
        return array(
            'version' => $this->getVersion(),
            'label' => $this->getLabel(),
            'link' => 'http://www.shopware.de',
            'description' => file_get_contents($this->Path() . 'info.txt')
        );
    }

    /**
     * Plugin install method
     *
     * @return bool success
     * @throws Exception
     */
    public function install()
    {
        // Check if Shopware version matches
        if (!$this->assertVersionGreaterThen('4.0.7')) {
            throw new Exception("This plugin requires Shopware 4.0.7 or a later version");
        }


        $this->createEvents();
        $this->createTables();
        $this->importData();

        return true;
    }

    /**
     * This event is needed to extend the shopware detail-page.
     * It displays the accessory-groups and -articles.
     *
     * @param Enlight_Event_EventArgs $args
     */
    public function onPostDispatchDetail(Enlight_Event_EventArgs $args)
    {
        $subject = $args->getSubject();
        $view = $subject->View();
        $request = $subject->Request();
        $response = $subject->Response();

        if (!$request->isDispatched() || $response->isException() || !$view->hasTemplate()) {
            return;
        }

        $groups = $this->getAccessories($view->sArticle["articleID"]);

        $this->registerMyTemplateDir();
        if (!$this->isTemplateResponsive()) {
            $view->extendsTemplate('frontend/plugins/swag_accessory/buy.tpl');
        }

        $sArticle = $view->sArticle;
        $sArticle["sAccessories"] = $groups;
        $view->sArticle = $sArticle;

        $view->templateVersion = Shopware()->Shop()->getTemplate()->getVersion();
    }

    /**
     * This method loads the new backend article-module.
     * This is necessary to extend the default article-module.
     *
     * @param Enlight_Event_EventArgs $args
     * @return bool success
     */
    public function loadArticleBackendModule(Enlight_Event_EventArgs $args)
    {
        $this->Application()->Snippets()->addConfigDir(
            $this->Path() . 'Snippets/'
        );

        $this->registerMyTemplateDir(true);

        if ($args->getRequest()->getActionName() === 'load') {
            $args->getSubject()->View()->extendsTemplate(
                'backend/article/view/accessory/detail/window.js'
            );
        }

        if ($args->getRequest()->getActionName() === 'index') {
            $args->getSubject()->View()->extendsTemplate(
                'backend/article/accessory_app.js'
            );
        }
    }

    /**
     * This method returns the path to the backend-controller to provide all information
     * the backend needs.
     *
     * @param Enlight_Event_EventArgs $args
     * @return string
     */
    public function onGetControllerPathBackend(Enlight_Event_EventArgs $args)
    {
        $this->Application()->Snippets()->addConfigDir(
            $this->Path() . 'Snippets/'
        );

        $this->registerMyTemplateDir(true);

        return $this->Path() . 'Controllers/Backend/SwagAccessory.php';
    }

    /**
     * Helper method to collect all information for the frontend.
     * It loads all accessory-groups and the options.
     * Furthermore it loads the translations, if they're set.
     *
     * @param $articleId Contains the id of the current article
     * @return array|bool
     */
    private function getAccessories($articleId)
    {
        $sql = "SELECT id,
                    name,
                    description,
                    image
                FROM s_article_configurator_accessory_groups
                WHERE article_id=?
                ORDER BY name ASC";
        $fetchGroups = Shopware()->Db()->fetchAssoc($sql, array($articleId));

        if (empty($fetchGroups)) {
            return false;
        }

        foreach ($fetchGroups as $groupId => &$configGroup) {
            $sql = "SELECT id,
                        optionname,
                        ordernumber
                    FROM s_article_configurator_accessory_articles
				    WHERE accessory_group_id=?
				    ORDER BY ordernumber ASC";
            $fetchOptions = Shopware()->Db()->fetchAll($sql, array($groupId));
            if (empty($fetchOptions)) {
                unset($fetchGroups[$groupId]);
            } else {
                foreach ($fetchOptions as $fetchOptionKey => &$fetchOptionValue) {
                    $article = Shopware()->Modules()->Articles()
                        ->sGetPromotionById("fix", 0, $fetchOptionValue["ordernumber"]);

                    if (!$article["price"]) {
                        unset($fetchOptions[$fetchOptionKey]);
                    } else {
                        $fetchOptionValue["price"] = $article["price"];
                        $fetchOptionValue["sArticle"] = $article;
                    }
                }
                $configGroup["childs"] = $fetchOptions;
            }
        }

        /**
         * Get translation for groups and options
         */
        if (!Shopware()->Shop()->getDefault()) {
            foreach ($fetchGroups as $groupId => &$group) {
                $sql = '
                    SELECT objectdata
                    FROM s_core_translations
                    WHERE objecttype=?
                        AND objectkey=?
                        AND objectlanguage=?';
                $objectData = Shopware()->Db()->fetchOne(
                    $sql,
                    array('accessorygroup', $groupId, Shopware()->Shop()->getId())
                );
                if (!empty($objectData)) {
                    $objectData = unserialize($objectData);
                } else {
                    continue;
                }
                $group = array_merge($group, $objectData);

                //Get the option-translations
                foreach ($group["childs"] as &$option) {
                    $sql = '
                        SELECT objectdata
                        FROM s_core_translations
                        WHERE objecttype=?
                            AND objectkey=?
                            AND objectlanguage=?';
                    $objectData = Shopware()->Db()->fetchOne(
                        $sql,
                        array(
                            'accessoryoption',
                            $option["id"],
                            Shopware()->Shop()->getId()
                        )
                    );
                    if (!empty($objectData)) {
                        $objectData = unserialize($objectData);
                    } else {
                        continue;
                    }
                    $option = array_merge($option, $objectData);
                }
            }
        }

        return $fetchGroups;
    }

    /**
     * Internal helper function to check if a database table exists.
     *
     * @param $tableName
     *
     * @return bool
     */
    private function tableExist($tableName)
    {
        $sql = "SHOW TABLES LIKE '" . $tableName . "'";
        $result = Shopware()->Db()->fetchRow($sql);

        return !empty($result);
    }

    /**
     * Helper method to create all events.
     *
     * @return void
     */
    private function createEvents()
    {
        $this->subscribeEvent(
            'Enlight_Controller_Action_PostDispatch_Backend_Article',
            'loadArticleBackendModule'
        );
        $this->subscribeEvent(
            'Enlight_Controller_Dispatcher_ControllerPath_Backend_SwagAccessory',
            'onGetControllerPathBackend'
        );

        $this->subscribeEvent(
            'Enlight_Controller_Action_PostDispatch_Frontend_Detail',
            'onPostDispatchDetail'
        );

        $this->subscribeEvent(
            'Theme_Compiler_Collect_Plugin_Less',
            'addLessFiles'
        );

        $this->subscribeEvent(
            'Theme_Compiler_Collect_Plugin_Javascript',
            'addJsFiles'
        );
    }

    /**
     * Helper method to create the needed tables.
     *
     * @return void
     */
    private function createTables()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `s_article_configurator_accessory_groups` (
                `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
                `article_id` INT NOT NULL ,
                `name` VARCHAR(255) NOT NULL ,
                `description` TEXT NOT NULL ,
                `image` VARCHAR(255) NOT NULL
            ) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
        ";
        Shopware()->Db()->query($sql, array());

        $sql = "
            CREATE TABLE IF NOT EXISTS `s_article_configurator_accessory_articles` (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `accessory_group_id` INT NOT NULL,
                `ordernumber` VARCHAR(255) NOT NULL,
                `optionname` VARCHAR(255) NOT NULL,
                PRIMARY KEY (`id`),
                UNIQUE KEY `accessory_group_id` (`accessory_group_id`,`ordernumber`)
            ) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
";
        Shopware()->Db()->query($sql, array());
    }

    /**
     * Helper method to import older accessory-data.
     *
     * @return void
     */
    private function importData()
    {
        if ($this->tableExist('s_articles_groups_accessories_option')) {
            $sql = "INSERT IGNORE INTO s_article_configurator_accessory_articles
                (accessory_group_id, ordernumber, optionname)
                SELECT CONCAT(articleID, IF(groupID < 10, '0', ''), groupID), ordernumber, optionname FROM s_articles_groups_accessories_option;";
            Shopware()->Db()->query($sql, array());
        }

        if ($this->tableExist('s_articles_groups_accessories')) {
            $sql = "INSERT IGNORE INTO s_article_configurator_accessory_groups
                (id, article_id, name, description, image)
                SELECT CONCAT(articleID, IF(groupID < 10, '0', ''), groupID), articleID, groupname, groupdescription, groupimage FROM s_articles_groups_accessories;";
            Shopware()->Db()->query($sql, array());
        }
    }

    /**
     * Provide the file collection for less
     *
     * @param Enlight_Event_EventArgs $args
     * @return \Doctrine\Common\Collections\ArrayCollection
     */
    public function addLessFiles(Enlight_Event_EventArgs $args)
    {
        $less = new \Shopware\Components\Theme\LessDefinition(
        //configuration
            array(),

            //less files to compile
            array(
                __DIR__ . '/Views/responsive/frontend/_public/src/less/all.less'
            ),

            //import directory
            __DIR__
        );

        return new Doctrine\Common\Collections\ArrayCollection(array($less));
    }

    public function addJsFiles(Enlight_Event_EventArgs $args)
    {
        $jsFiles = array(__DIR__ . '/Views/responsive/frontend/_public/src/js/swag_accessory.js');

        return new Doctrine\Common\Collections\ArrayCollection($jsFiles);
    }

    /**
     * Checks if the the current Template is responsive
     *
     * @return bool
     */
    private function isTemplateResponsive()
    {
        $template = Shopware()->Shop()->getTemplate()->getVersion();
        if ($template < 3) {
            return false;
        }

        return true;
    }

    protected function registerMyTemplateDir($isBackend = false)
    {
        if ($isBackend) {
            $this->Application()->Template()->addTemplateDir(
                $this->Path() . 'Views/'
            );
        } elseif ($this->isTemplateResponsive()) {
            $this->Application()->Template()->addTemplateDir(
                $this->Path() . 'Views/responsive'
            );
        } else {
            $this->Application()->Template()->addTemplateDir(
                $this->Path() . 'Views/'
            );
        }
    }
}
