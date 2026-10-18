package com.febuki.tool.server.dto;

import com.alibaba.fastjson.annotation.JSONField;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Schema(description = "车次信息")
public class TrainInfoDTO {
    @Schema(description = "车次号", example = "G25")
    @JSONField(name = "train_no")
    private String trainNo;

    @Schema(description = "出发站", example = "北京南")
    @JSONField(name = "departure_station")
    private String departureStation;

    @Schema(description = "到达站", example = "苏州北")
    @JSONField(name = "arrival_station")
    private String arrivalStation;

    @Schema(description = "出发站点编码", example = "VNP")
    @JSONField(name = "departure_station_code")
    private String departureStationCode;

    @Schema(description = "到达站点编码", example = "OHH")
    @JSONField(name = "arrival_station_code")
    private String arrivalStationCode;

    @Schema(description = "出发时间", example = "18:04")
    @JSONField(name = "departure_time")
    private String departureTime;

    @Schema(description = "到达时间", example = "22:32")
    @JSONField(name = "arrival_time")
    private String arrivalTime;

    @Schema(description = "历时", example = "04:28")
    @JSONField(name = "duration")
    private String duration;

    @Schema(description = "班次在12306上是否可预定", example = "Y")
    @JSONField(name = "enable_booking")
    private String enableBooking;

    @Schema(description = "票价信息")
    @JSONField(name = "prices")
    private List<PriceInfoDTO> prices;

    @Schema(description = "列车标签", example = "智能动车组、复兴号、静音车厢")
    @JSONField(name = "train_flags")
    private List<String> trainFlags;

    public TrainInfoDTO() {
    }

    public TrainInfoDTO(
            String trainNo,
            String departureStation,
            String arrivalStation,
            String departureStationCode,
            String arrivalStationCode,
            String departureTime,
            String arrivalTime,
            String duration,
            String enableBooking,
            List<PriceInfoDTO> prices,
            List<String> trainFlags
    ) {
        this.trainNo = trainNo;
        this.departureStation = departureStation;
        this.arrivalStation = arrivalStation;
        this.departureStationCode = departureStationCode;
        this.arrivalStationCode = arrivalStationCode;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.duration = duration;
        this.enableBooking = enableBooking;
        this.prices = prices;
        this.trainFlags = trainFlags;
    }
}
