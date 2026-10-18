package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "产品信息")
public class ProductDTO {
    @Schema(description = "产品id", hidden = true)
    private Long id;

    @NotBlank(message = "产品名称不能为空")
    @Schema(description = "产品名称")
    private String name;

    @NotBlank(message = "目的地不能为空")
    @Schema(description = "目的地")
    private String destination;

    @NotNull(message = "价格不能为空")
    @DecimalMin(value = "0.0", message = "价格不能小于0")
    @Schema(description = "价格")
    private BigDecimal price;

    @NotBlank(message = "行程安排不能为空")
    @Schema(description = "行程")
    private String itinerary;

    @NotNull(message = "发布者ID不能为空")
    @Schema(description = "发布者ID (商户ID)")
    private Long userId;

    @Schema(description = "产品描述")
    private String description;

    @NotNull(message = "库存不能为空")
    @Min(value = 0, message = "库存不能小于0")
    @Schema(description = "库存")
    private Long stock;

    @Schema(description = "状态")
    private boolean status;

    @Schema(description = "是否包含酒店", example = "true")
    private boolean hotelOrNo;

    @Schema(description = "酒店名称", example = "三亚希尔顿酒店")
    private String hotel;

    public ProductDTO() {}

    public ProductDTO(Long id, String name, String destination, BigDecimal price, Long userId, String description, Long stock, boolean status, boolean hotelOrNo, String hotel) {
        this.id = id;
        this.name = name;
        this.destination = destination;
        this.price = price;
        this.itinerary = "";
        this.userId = userId;
        this.description = description;
        this.stock = stock;
        this.status = status;
        this.hotelOrNo = hotelOrNo;
        this.hotel = hotel;
    }
}
