package com.febuki.tool.server.dto;

import com.alibaba.fastjson.annotation.JSONField;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "车次价格信息")
public class PriceInfoDTO {
    @Schema(description = "座位名称", example = "商务座")
    @JSONField(name = "seat_name")
    private String seatName;

    @Schema(description = "座位类型编码", example = "9")
    @JSONField(name = "seat_type_code")
    private String seatTypeCode;

    @Schema(description = "座位价格", example = "969")
    @JSONField(name = "price")
    private int price;

    @Schema(description = "折扣", example = "87")
    @JSONField(name = "discount")
    private int discount;

    @Schema(description = "座位数，有/无或数字", example = "15")
    @JSONField(name = "num")
    private String num;

    public PriceInfoDTO() {
    }

    public PriceInfoDTO(String seatName, String seatTypeCode, int price, int discount, String num) {
        this.seatName = seatName;
        this.seatTypeCode = seatTypeCode;
        this.price = price;
        this.discount = discount;
        this.num = num;
    }
}
