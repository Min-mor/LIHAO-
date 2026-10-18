package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "景点查询参数，接口包含全国所有知名不知名的景区景点、度假山庄、博物馆等信息。按省市分类，可模糊搜索。word、province、city三个参数必填其中一个。num参数默认1，最大15。")
public class ScenicRequestDTO {
    @Schema(description = "景区关键字", example = "公园")
    private String word;

    @Schema(description = "返回数量，默认1，最大15", example = "15")
    private String num;

    @Schema(description = "翻页", example = "1")
    private String page = "1";

    @Schema(description = "按景点省区检索", example = "北京")
    private String province = "北京";

    @Schema(description = "按景点市区检索", example = "北京")
    private String city = "北京";

    public ScenicRequestDTO() {
    }

    public ScenicRequestDTO(String word, String num, String page, String province, String city) {
        this.word = word;
        this.num = num;
        this.page = page;
        this.province = province;
        this.city = city;
    }
}
