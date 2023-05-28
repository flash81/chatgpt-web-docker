/*
 Navicat MySQL Data Transfer

 Source Server         : sfsdf
 Source Server Type    : MySQL
 Source Server Version : 50736
 Source Host           : localhost
 Source Database       : base

 Target Server Type    : MySQL
 Target Server Version : 50736
 File Encoding         : utf-8

 Date: 05/28/2023 15:34:20 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `admin_config`
-- ----------------------------
DROP TABLE IF EXISTS `admin_config`;
CREATE TABLE `admin_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '类型0文本1图片2富文本',
  `name` varchar(45) NOT NULL,
  `value` text NOT NULL,
  `description` varchar(45) NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index2` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- ----------------------------
--  Records of `admin_config`
-- ----------------------------
BEGIN;
INSERT INTO `admin_config` VALUES ('3', '0', 'free_day', '1', '免费使用天数', '2023-04-24 21:49:36', '2023-05-17 17:59:31');
COMMIT;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(10) unsigned NOT NULL DEFAULT '0',
  `mobile` char(11) NOT NULL DEFAULT '' COMMENT '手机号',
  `nickname` varchar(45) NOT NULL DEFAULT '' COMMENT '用户昵称',
  `avatar` varchar(255) NOT NULL DEFAULT '' COMMENT '头像',
  `password` varchar(100) NOT NULL,
  `remember_token` varchar(100) NOT NULL DEFAULT '',
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '是否允许登录0禁止1正常',
  `can_image` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '图像权限',
  `last_login_at` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '上次登录时间',
  `expired_time` datetime DEFAULT NULL COMMENT '过期时间',
  `created_at` int(10) unsigned NOT NULL DEFAULT '0',
  `updated_at` int(10) unsigned NOT NULL DEFAULT '0',
  `deleted_at` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `token_idx` (`remember_token`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='用户表';

-- ----------------------------
--  Table structure for `user_chat`
-- ----------------------------
DROP TABLE IF EXISTS `user_chat`;
CREATE TABLE `user_chat` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `api` varchar(45) NOT NULL,
  `content` text,
  `created_at` int(10) unsigned NOT NULL DEFAULT '0',
  `updated_at` int(10) unsigned NOT NULL DEFAULT '0',
  `deleted_at` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_order_user1_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='订单';

SET FOREIGN_KEY_CHECKS = 1;
