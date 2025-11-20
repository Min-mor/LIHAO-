package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "车次查询参数")
public class TrainScheduleRequestDTO {
    @Schema(description = "查询方式。1-通过站点名称，2-通过站点编码", example = "1")
    private String searchType = "1";

    @Schema(description = "出发站（例如：北京、VNP）", example = "北京")
    private String departureStation = "北京";

    @Schema(description = "到达站（例如：苏州、OHH）", example = "上海")
    private String arrivalStation = "上海";

    @Schema(description = "出发时间，仅允许15天内的日期", example = "2025-11-19")
    private String date = "2025-11-19";

    @Schema(description = "车次筛选条件，默认所有。", example = "G")
    private String filter = "G";

    @Schema(description = "是否可预定班次。1-仅返回可预定的班次，2-所有", example = "1")
    private String enableBooking = "1";

    @Schema(description = "出发时间选择。凌晨-[0:00-06:00),上午-[6:00-12:00),下午-[12:00-18:00),晚上-[18:00-24:00)", example = "上午")
    private String departureTimeRange = "上午";

    public TrainScheduleRequestDTO() {
    }

    public TrainScheduleRequestDTO(
            String searchType,
            String departureStation,
            String arrivalStation,
            String date,
            String filter,
            String enableBooking,
            String departureTimeRange
    ) {
        this.searchType = searchType;
        this.departureStation = departureStation;
        this.arrivalStation = arrivalStation;
        this.date = date;
        this.filter = filter;
        this.enableBooking = enableBooking;
        this.departureTimeRange = departureTimeRange;
    }
}
