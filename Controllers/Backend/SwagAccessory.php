<?php
/*
 * (c) shopware AG <info@shopware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

class Shopware_Controllers_Backend_SwagAccessory extends Shopware_Controllers_Backend_ExtJs
{
    /**
     * Function to get all accessory-groups and the associated articles
     */
    public function getAccessoryGroupsAction()
    {
        try {
            $start = (int) $this->Request()->get('start');
            $limit = (int) $this->Request()->get('limit');
            $sort = (array) $this->Request()->getParam('sort', array());
            $articleId = (int) $this->Request()->get('articleId');

            if (!empty($sort)) {
                $direction = $sort[0]["direction"];
                $property = $sort[0]["property"];
                $sqlOrder = "ORDER BY {$property} {$direction}";
            } else {
                $sqlOrder = "";
            }

            $sql = "SELECT acag.*
                    FROM s_article_configurator_accessory_groups acag
                    WHERE article_id = :articleId
                    {$sqlOrder}
                    LIMIT :start, :limit
            ";
            $prepared = Shopware()->Db()->prepare($sql);
            $prepared->bindParam(':articleId', $articleId, PDO::PARAM_INT);
            $prepared->bindParam(':start', $start, PDO::PARAM_INT);
            $prepared->bindParam(':limit', $limit, PDO::PARAM_INT);
            $prepared->execute();

            $groups = $prepared->fetchAll();

            //Get all articles to the groups
            foreach ($groups as &$group) {
                $sql = "
                    SELECT acaa.*, a.name
                    FROM s_article_configurator_accessory_articles acaa
                    LEFT JOIN s_articles_details ad ON acaa.ordernumber = ad.ordernumber
                    LEFT JOIN s_articles a ON ad.articleID = a.id
                    WHERE accessory_group_id = ?";
                $group['articles'] = Shopware()->Db()->fetchAll($sql, array($group["id"]));
                $group["count"] = count($group["articles"]);
            }

            $this->View()->assign(array("success" => true, "data" => $groups));
        } catch (Exception $e) {
            $this->View()->assign(array("success" => false, "errorMsg" => $e->getMessage()));
        }
    }

    /**
     * Function to create an accessory-group
     */
    public function createAccessoryGroupAction()
    {
        try {
            $name = $this->Request()->get("name");
            $articleId = $this->Request()->get("article_id");

            Shopware()->Db()->query(
                "INSERT INTO s_article_configurator_accessory_groups (name, article_id) VALUES (?, ?)",
                array($name, $articleId)
            );

            $this->View()->assign(array("success" => true, "data" => $name));
        } catch (Exception $e) {
            $this->View()->assign(array("success" => false, "errorMsg" => $e->getMessage()));
        }
    }

    /**
     * Function to edit an accessory-article
     */
    public function updateGroupArticleAction()
    {
        try {
            $params = $this->Request()->getParams();
            $optionName = $params["optionname"];
            $orderNumber = $params["ordernumber"];
            $accessoryGroupId = $params["accessory_group_id"];

            $sql = "
                UPDATE s_article_configurator_accessory_articles
                SET optionname = ?
                WHERE accessory_group_id = ?
                AND ordernumber = ?";
            Shopware()->Db()->query($sql, array($optionName, $accessoryGroupId, $orderNumber));

            $this->View()->assign(array("success" => true));
        } catch (Exception $e) {
            $this->View()->assign(array("success" => false, "errorMsg" => $e->getMessage()));
        }
    }

    /**
     * Function to edit an accessory-group
     */
    public function updateAccessoryGroupAction()
    {
        try {
            $params = $this->Request()->getParams();
            $articles = $params["articles"];

            Shopware()->Db()->query("
                UPDATE s_article_configurator_accessory_groups
                SET name=?, description=?
                WHERE id=?",
                array($params["name"], $params["description"], $params["id"])
            );

            foreach ($articles as $article) {
                $sql = "INSERT IGNORE INTO s_article_configurator_accessory_articles (ordernumber, accessory_group_id) VALUES(?, ?)";
                Shopware()->Db()->query($sql, array($article["ordernumber"], $params["id"]));
            }

            $this->View()->assign(array("success" => true, 'lastInsert' => Shopware()->Db()->lastInsertId()));
        } catch (Exception $e) {
            $this->View()->assign(array("success" => false, "errorMsg" => $e->getMessage()));
        }
    }

    /**
     * Function to delete one or multiple accessory-groups
     */
    public function deleteGroupsAction()
    {
        try {
            $params = $this->Request()->getParams();

            unset($params['module']);
            unset($params['controller']);
            unset($params['action']);
            unset($params['_dc']);

            if ($params[0]) {
                foreach ($params as $values) {
                    $this->deleteGroup($values);
                }
            } else {
                $this->deleteGroup($params);
            }
            $this->View()->assign(array('success' => true));
        } catch (Exception $e) {
            $this->View()->assign(array('success' => false, 'errorMsg' => $e->getMessage()));
        }
    }

    /**
     * Function to remove a single accessory-article
     */
    public function deleteGroupArticleAction()
    {
        $params = $this->Request()->getParams();
        try {
            Shopware()->Db()->query("
                DELETE FROM s_article_configurator_accessory_articles
                WHERE ordernumber=?
                AND accessory_group_id =?",
                array($params["ordernumber"], $params["accessory_group_id"])
            );

            $this->View()->assign(array('success' => true));
        } catch (Exception $e) {
            $this->View()->assign(array('success' => false, 'errorMsg' => $e->getMessage()));
        }
    }

    /**
     * Helper function to delete one or multiple accessory-groups and the articles,
     * which belong to the group
     *
     * @param $array
     */
    private function deleteGroup($array)
    {
        Shopware()->Db()->query("
            DELETE FROM s_article_configurator_accessory_groups
            WHERE id=?",
            array($array["id"])
        );
        ;
        Shopware()->Db()->query("
            DELETE FROM s_article_configurator_accessory_articles
            WHERE accessory_group_id=?",
            array($array["id"])
        );
    }
}
