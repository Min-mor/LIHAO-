# 概述
本数据库用于 **(应用名)** 数据存储，包括用户信息、购物信息、行程信息等。主要功能包括记录用户、商家、管理员信息，记录用户购物信息，记录行程信息，记录收藏信息等。设计目标是提供一个高效、可靠的数据存储和检索系统，以支持 **(应用名)** 的各种业务需求。


# 一、数据库架构

## 1、用户表（users）
用户表用于存储用户的基本信息，包括用户ID、用户名、昵称、密码、手机号、邮箱、用户身份、头像、用户状态等。用户表的主键是用户ID，用户名、手机号、邮箱是唯一索引，用于唯一标识一个用户。

| 字段名        | 数据类型    | 约束条件 | 默认值 | 描述             |
| ------------- | ----------- | -------- | ------ | ---------------- |
| user_id       | int         | 主键，自增       |        | 用户ID           |
| user_name     | char         |  唯一，非空      |        | 用户名           |
| nickname       | varchar         | 无       |  user      | 昵称         |
| password       | varchar        | 无       |        | 密码           |
| tel       | varchar         | 唯一       |        | 手机号           |
| email       | varchar         | 唯一       |        | 邮箱           |
| role      | varchar        |非空       |        | 用户身份（用户/商家/管理员） |
| avatar_url     | varchar         | 无       |        | 头像地址           |
| status       |  boolean        | 无       |        | 用户状态（正常/禁用） |

## 2、商家信息表（merchants）
商家信息表用于存储商家信息，包括商家id、商家名称、营业执照、入驻审核状态、审核人员（管理员）id等。商家信息表的主键是商家id，商家名称是唯一索引，用于唯一标识一个商家。

| 字段名        | 数据类型    | 约束条件 | 默认值 | 描述             |
| ------------- | ----------- | -------- | ------ | ---------------- |
| user_id       | int     | 主键    |        | 商家ID（user表user_id外键）|
| company_name  | varchar | 唯一，非空 |        | 商家名称           |
| business_license_url | varchar | 非空 |        | 营业执照图片地址 |
| verification_status | tinyint | 非空 |        | 入驻审核状态（0：待审核，1：审核通过，2：审核不通过） |
| approved_by | int | 非空 |        | 审核人员（管理员）ID（user表user_id外键） |

## 3、产品信息表（products）
产品信息表用于存储产品信息，包括产品id、产品名称、目的地、产品价格、行程、商家id、产品描述、库存、状态、酒店等。产品信息表的主键是产品id，产品id是唯一索引，用于唯一标识一个产品。

| 字段名        | 数据类型    | 约束条件 | 默认值 | 描述             |
|------------- | ----------- | -------- | ------ | ---------------- |
| product_id       | int     | 主键    |        | 产品ID           |
| product_name  | varchar | 非空 |        | 产品名称           |
| destination_name | varchar | 非空 |        | 目的地名称 |
| price | decimal | 非空 |    0    | 产品价格（精度：（大小；10，小数点后：2）） |
| itinerary | varchar | 非空 |        | 行程 |
| user_id | int | 非空 |        | 商家ID（user表user_id外键） |
| description | varchar | 无 |        | 产品描述 |
| stock | int | 非空 |        | 库存 |
| status | tinyint | 非空 |        | 状态（0：下架，1：上架） |
| hotel | varchar | 非空 |        | 酒店名称 |

## 4、订单表(orders)
订单表用于存储订单信息，包括订单id、订单编号、用户id、产品id、订单总金额、支付状态、订单状态、创建时间、支付时间、退款状态、退款时间、退款金额、退款原因、订单备注等。订单表的主键是订单id，订单id、订单编号是唯一索引，用于唯一标识一个订单。
| 字段名        | 数据类型    | 约束条件 | 默认值 | 描述             |
|------------- | ----------- | -------- | ------ | ---------------- |
| order_id       | int     | 主键,自增   |        | 订单ID           |
| order_sn | bigint | 非空 |        | 订单编号           |
| user_id | int | 非空 |        | 用户ID（user表user_id外键） |
| product_id | int | 非空 |        | 产品ID（product表product_id外键） |
| total_amount | decimal | 非空 |        | 订单总金额（精度：（大小；10，小数点后：2）） |
| payment_status | boolean | 非空 |        | 支付状态（0：未支付，1：已支付） |
| order_status | tinyint | 非空 |        | 订单状态（0：待支付，1：已支付，2：已取消，3：已完成） |
| create_time | datetime | 非空 |        | 创建时间           |

## 5、订单项表(order_items)
订单项表用于存储订单项信息，包括订单项id、订单id、产品id、产品信息快照、数量、产品价格快照等。订单项表的主键是订单项id，订单项id是唯一索引，用于唯一标识一个订单项。
| 字段名        | 数据类型    | 约束条件 | 默认值 | 描述             |
|------------- | ----------- | -------- | ------ | ---------------- |
| id       | int | 主键,自增   |        | 订单项ID           |
| order_id | int | 非空 |        | 订单ID（order表order_id外键） |
| product_id | int | 非空 |        | 产品ID（product表product_id外键） |
| product_title | json | 非空 |        | 冗余快照，防止原产品信息变动      |
| unit_price | decimal | 非空 |        | 冗余快照，记录下单时价格（精度：（大小；10，小数点后：2）） |
| quantity | int | 非空 |        | 数量             |

## 6、用户收藏表(user_collections)
用户收藏表用于存储用户收藏信息，包括id、用户id、收藏商品类型、商品id、数据来源、快照项目名、快照的项目封面图URL、收藏创建时间等。用户收藏表的主键是id和产品id的组合，id和产品id是联合唯一索引，用于唯一标识一个用户收藏。
| 字段名        | 数据类型    | 约束条件 | 默认值 | 描述             |
|------------- | ----------- | -------- | ------ | ---------------- |
| id       | int | 主键,自增   |        | 收藏ID           |
| user_id | int | 非空 |        | 用户ID（user表user_id外键） |
| item_type | varchar | 非空 |        | 收藏商品类型 |
| item_id | int | 非空 |        | 商品ID（product表product_id外键） |
| item_provider | varchar | 非空 |        | 数据来源(''self'', ''amap'', ''ctrip'') |
| item_name | varchar | 非空 |        | 快照项目名 |
| item_image_url | varchar | 非空 |        | 快照的项目封面图URL |
| create_time | datetime | 非空 |        | 收藏创建时间 |

## 7、统一旅客信息表(travelers)
统一旅客信息表用于存储旅客信息，包括id、用户id、姓名、手机号、证件类型、证件号码、旅客类型等。统一旅客信息表的主键是id，id是自增主键，用于唯一标识一个旅客信息。
| 字段名        | 数据类型    | 约束条件 | 默认值 | 描述             |
|------------- | ----------- | -------- | ------ | ---------------- |
| id       | int | 主键,自增   |        | 旅客ID           |
| user_id | int | 非空 |        | 用户ID（user表user_id外键） |
| full_name | varchar | 非空 |        | 姓名 |
| phone | int | 非空 |        | 手机号 |
| id_card_type | tinyint | 非空 |        | 证件类型(1:身份证,2:护照,3:港澳通行证,4:台湾通行证) |
| id_card_number | varchar | 非空 |        | 证件号码 |
| traveler_type | varchar | 非空 |        | 旅客类型(1:成人,2:儿童) |

# 二、关系和约束的描述

## 2.1表关系

### 2.1.1 用户表(users)和收藏表(user_collections)的关系
用户表(users)和收藏表(user_collections)之间是多对多的关系，即一个用户可以收藏多个商品，一个商品也可以被多个用户收藏。具体来说，用户表(users)中的user_id字段是收藏表(user_collections)中的user_id字段的外键，通过这个外键可以建立用户表(users)和收藏表(user_collections)之间的关联。

### 2.1.2 用户表(users)和统一旅客信息表(travelers)的关系
用户表(users)和统一旅客信息表(travelers)之间是一对多的关系，即一个用户可以有多个旅客信息。具体来说，用户表(users)中的user_id字段是统一旅客信息表(travelers)中的user_id字段的外键，通过这个外键可以建立用户表(users)和统一旅客信息表(travelers)之间的关联。

### 2.1.3 用户表(users)和订单表(orders)的关系
用户表(users)和订单表(orders)之间是一对多的关系，即一个用户可以有多个订单。具体来说，用户表(users)中的user_id字段是订单表(orders)中的user_id字段的外键，通过这个外键可以建立用户表(users)和订单表(orders)之间的关联。

### 2.1.4 订单表(orders)和产品信息表（products）的关系
订单表(orders)和产品信息表（products）之间是多对多的关系，即一个订单可以包含多个产品，一个产品也可以被多个订单包含。具体来说，订单表(orders)中的product_id字段是产品信息表（products）中的product_id字段的外键，通过这个外键可以建立订单表(orders)和产品信息表（products）之间的关联。

### 2.1.5 订单表(orders)和旅客信息表(travelers)的关系
订单表(orders)和旅客信息表(travelers)之间是多对多的关系，即一个订单可以包含多个旅客信息，一个旅客信息也可以被多个订单包含。具体来说，订单表(orders)中的traveler_id字段是旅客信息表(travelers)中的traveler_id字段的外键，通过这个外键可以建立订单表(orders)和旅客信息表(travelers)之间的关联。

### 2.1.6 订单表（orders）和订单项表（order_items）的关系
订单表（orders）和订单项表（order_items）之间是一对多的关系，即一个订单可以有多个订单项。具体来说，订单表（orders）中的order_id字段是订单项表（order_items）中的order_id字段的外键，通过这个外键可以建立订单表（orders）和订单项表（order_items）之间的关联。

### 2.1.7 商家信息表（merchants）和产品信息表（products）的关系
商家信息表（merchants）和产品信息表（products）之间是一对多的关系，即一个商家可以有多个产品。具体来说，商家信息表（merchants）中的merchant_id字段是产品信息表（products）中的merchant_id字段的外键，通过这个外键可以建立商家信息表（merchants）和产品信息表（products）之间的关联。

## 2.2约束

### 2.2.1 主键约束
主键约束用于唯一标识表中的每一行数据，每个表只能有一个主键。在用户表(users)中，user_id字段被设置为主键，用于唯一标识每个用户。

### 2.2.2 外键约束
外键约束用于建立表之间的关联关系，确保数据的完整性和一致性。在订单表(orders)中，user_id字段是用户表(users)中的外键，用于建立订单表(orders)和用户表(users)之间的关联关系。

### 2.2.3 唯一约束
唯一约束用于确保表中的某个字段或字段的组合是唯一的，不能有重复的值。在用户表(users)中，email字段被设置为唯一约束，确保每个用户的电子邮件地址是唯一的。

### 2.2.4 非空约束
非空约束用于确保表中的某个字段必须有值，不能为空。在用户表(users)中，user_id、user_name、password、email字段都被设置为非空约束，确保每个用户必须有用户ID、用户名、密码和邮箱。

# 三、示例数据

## 3.1 用户表（users）

## 3.2 商家信息表（merchants）

## 3.3 产品信息表（products）

## 3.4 订单表（orders）

## 3.5 订单项表（order_items）

## 3.6 用户收藏表(user_collections)

## 3.7 统一旅客信息表(travelers)

# 四、版本管理

## 4.1 版本管理策略

### 4.1.1 版本号命名规则
版本号采用语义化版本号（Semantic Versioning）的命名规则，格式为X.Y.Z，其中X表示主版本号，Y表示次版本号，Z表示修订号。

### 4.1.2 变更记录
详细记录每次变更的内容、日期、变更人等信息。

### 4.1.3 版本管理记录
| 版本号 | 变更内容 | 变更日期 | 变更人 |
| --- | --- | --- | --- |
| 1.0.0 | 初始版本 | 2025-10-22 | 郭枫 |

# 五、总结
撰写高质量的数据库文档需要仔细规划和详细描述。通过清晰的结构、详细的内容、版本管理和使用规范化的文档工具，可以确保数据库文档的可读性和实用性。最终，数据库文档不仅是技术记录，更是团队协作和项目管理的重要工具。