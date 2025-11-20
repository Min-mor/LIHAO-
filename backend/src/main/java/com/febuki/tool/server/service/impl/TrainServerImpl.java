package com.febuki.tool.server.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.parser.Feature;
import com.febuki.tool.server.config.JuheConfig;
import com.febuki.tool.server.dto.TrainScheduleRequestDTO;
import com.febuki.tool.server.dto.TrainScheduleResponseDTO;
import com.febuki.tool.server.service.TrainServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service("trainManagementServer")
public class TrainServerImpl implements TrainServer {

    private final JuheConfig juheConfig;

    public TrainServerImpl(@Autowired JuheConfig juheConfig) {
        this.juheConfig = juheConfig;
    }

    @Override
    public TrainScheduleResponseDTO getTrainSchedule(TrainScheduleRequestDTO trainScheduleRequestDTO) throws IOException {
        HashMap<String, String> map = getStringHashMap(trainScheduleRequestDTO);

        URL url = new URL(String.format("%s?%s", juheConfig.getUrl() + "fapigw/train/query", params(map)));

        BufferedReader in = new BufferedReader(new InputStreamReader((url.openConnection().getInputStream())));
        String inputLine;
        StringBuffer response = new StringBuffer();
        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();
        System.out.println(response);

        // 测试数据
        // String response = "{\"reason\":\"success.\",\"result\":[{\"train_no\":\"G103\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"06:20\",\"arrival_time\":\"11:58\",\"duration\":\"05:38\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":1998,\"discount\":87,\"num\":\"15\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":969,\"discount\":92,\"num\":\"有\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":576,\"discount\":87,\"num\":\"有\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":576,\"discount\":87,\"num\":\"有\"}],\"train_flags\":[\"智能动车组\",\"复兴号\"]},{\"train_no\":\"G1\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"SHH\",\"departure_time\":\"07:00\",\"arrival_time\":\"11:29\",\"duration\":\"04:29\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":2337,\"discount\":null,\"num\":\"8\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1070,\"discount\":null,\"num\":\"2\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":669,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"优选一等座\",\"seat_type_code\":\"D\",\"price\":1471,\"discount\":null,\"num\":\"2\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":669,\"discount\":null,\"num\":\"有\"}],\"train_flags\":[\"智能动车组\",\"复兴号\",\"静音车厢\"]},{\"train_no\":\"G105\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"07:17\",\"arrival_time\":\"13:03\",\"duration\":\"05:46\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":1998,\"discount\":87,\"num\":\"15\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1006,\"discount\":95,\"num\":\"有\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":598,\"discount\":91,\"num\":\"有\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":598,\"discount\":91,\"num\":\"有\"}],\"train_flags\":[\"复兴号\"]},{\"train_no\":\"G107\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"07:25\",\"arrival_time\":\"13:12\",\"duration\":\"05:47\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":1873,\"discount\":81,\"num\":\"15\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":930,\"discount\":88,\"num\":\"有\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":553,\"discount\":84,\"num\":\"无\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":553,\"discount\":84,\"num\":\"有\"}],\"train_flags\":[]},{\"train_no\":\"G3\",\"departure_station\":\"北京\",\"arrival_station\":\"上海\",\"departure_station_code\":\"BJP\",\"arrival_station_code\":\"SHH\",\"departure_time\":\"07:40\",\"arrival_time\":\"12:32\",\"duration\":\"04:52\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":2350,\"discount\":null,\"num\":\"5\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1076,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":673,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":673,\"discount\":null,\"num\":\"有\"}],\"train_flags\":[\"复兴号\"]},{\"train_no\":\"G109\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"07:45\",\"arrival_time\":\"13:49\",\"duration\":\"06:04\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":2158,\"discount\":94,\"num\":\"16\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1006,\"discount\":95,\"num\":\"有\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":598,\"discount\":91,\"num\":\"有\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":598,\"discount\":91,\"num\":\"有\"}],\"train_flags\":[\"复兴号\"]},{\"train_no\":\"G3\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"SHH\",\"departure_time\":\"08:00\",\"arrival_time\":\"12:32\",\"duration\":\"04:32\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":2337,\"discount\":null,\"num\":\"5\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1070,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":669,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":669,\"discount\":null,\"num\":\"有\"}],\"train_flags\":[\"复兴号\"]},{\"train_no\":\"G111\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"08:16\",\"arrival_time\":\"14:11\",\"duration\":\"05:55\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":2158,\"discount\":94,\"num\":\"16\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1006,\"discount\":95,\"num\":\"有\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":598,\"discount\":91,\"num\":\"有\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":598,\"discount\":91,\"num\":\"有\"}],\"train_flags\":[\"复兴号\"]},{\"train_no\":\"G113\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"08:39\",\"arrival_time\":\"15:01\",\"duration\":\"06:22\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":1956,\"discount\":79,\"num\":\"12\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1006,\"discount\":89,\"num\":\"有\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":607,\"discount\":85,\"num\":\"有\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":607,\"discount\":85,\"num\":\"有\"}],\"train_flags\":[\"复兴号\"]},{\"train_no\":\"G5\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"09:00\",\"arrival_time\":\"13:37\",\"duration\":\"04:37\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":2318,\"discount\":null,\"num\":\"5\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1060,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":662,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"优选一等座\",\"seat_type_code\":\"D\",\"price\":1457,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":662,\"discount\":null,\"num\":\"有\"}],\"train_flags\":[\"智能动车组\",\"复兴号\",\"静音车厢\"]},{\"train_no\":\"G115\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"09:10\",\"arrival_time\":\"14:48\",\"duration\":\"05:38\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":1998,\"discount\":87,\"num\":\"9\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":969,\"discount\":92,\"num\":\"4\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":576,\"discount\":87,\"num\":\"19\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":576,\"discount\":87,\"num\":\"有\"}],\"train_flags\":[\"复兴号\"]},{\"train_no\":\"G117\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"09:20\",\"arrival_time\":\"14:55\",\"duration\":\"05:35\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":2158,\"discount\":94,\"num\":\"15\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1006,\"discount\":95,\"num\":\"有\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":598,\"discount\":91,\"num\":\"有\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":598,\"discount\":91,\"num\":\"有\"}],\"train_flags\":[\"复兴号\"]},{\"train_no\":\"G119\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"09:24\",\"arrival_time\":\"15:31\",\"duration\":\"06:07\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":1873,\"discount\":81,\"num\":\"11\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":930,\"discount\":88,\"num\":\"有\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":553,\"discount\":84,\"num\":\"无\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":553,\"discount\":84,\"num\":\"有\"}],\"train_flags\":[\"复兴号\"]},{\"train_no\":\"G7\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"10:00\",\"arrival_time\":\"14:35\",\"duration\":\"04:35\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":2318,\"discount\":null,\"num\":\"2\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1060,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":662,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"优选一等座\",\"seat_type_code\":\"D\",\"price\":1457,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":662,\"discount\":null,\"num\":\"有\"}],\"train_flags\":[\"智能动车组\",\"复兴号\"]},{\"train_no\":\"G121\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"10:05\",\"arrival_time\":\"15:41\",\"duration\":\"05:36\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":2318,\"discount\":null,\"num\":\"13\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1035,\"discount\":98,\"num\":\"2\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":626,\"discount\":95,\"num\":\"有\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":626,\"discount\":95,\"num\":\"有\"}],\"train_flags\":[\"复兴号\"]},{\"train_no\":\"G123\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"10:14\",\"arrival_time\":\"16:26\",\"duration\":\"06:12\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":2158,\"discount\":94,\"num\":\"17\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1006,\"discount\":95,\"num\":\"有\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":598,\"discount\":91,\"num\":\"有\"}],\"train_flags\":[\"复兴号\"]},{\"train_no\":\"G125\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"10:48\",\"arrival_time\":\"16:50\",\"duration\":\"06:02\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":1998,\"discount\":87,\"num\":\"11\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":969,\"discount\":92,\"num\":\"有\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":576,\"discount\":87,\"num\":\"有\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":576,\"discount\":87,\"num\":\"有\"}],\"train_flags\":[]},{\"train_no\":\"G9\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"11:00\",\"arrival_time\":\"15:37\",\"duration\":\"04:37\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":2318,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1060,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":662,\"discount\":null,\"num\":\"无\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":662,\"discount\":null,\"num\":\"有\"}],\"train_flags\":[\"智能动车组\",\"复兴号\"]},{\"train_no\":\"G127\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"11:05\",\"arrival_time\":\"17:08\",\"duration\":\"06:03\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":1873,\"discount\":81,\"num\":\"4\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":930,\"discount\":88,\"num\":\"有\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":553,\"discount\":84,\"num\":\"有\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":553,\"discount\":84,\"num\":\"有\"}],\"train_flags\":[\"复兴号\"]},{\"train_no\":\"G129\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"11:18\",\"arrival_time\":\"17:38\",\"duration\":\"06:20\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":1998,\"discount\":87,\"num\":\"13\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1006,\"discount\":95,\"num\":\"有\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":598,\"discount\":91,\"num\":\"有\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":598,\"discount\":91,\"num\":\"有\"}],\"train_flags\":[\"智能动车组\",\"复兴号\"]},{\"train_no\":\"G131\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海虹桥\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"AOH\",\"departure_time\":\"11:27\",\"arrival_time\":\"17:22\",\"duration\":\"05:55\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":2318,\"discount\":null,\"num\":\"6\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1035,\"discount\":98,\"num\":\"12\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":626,\"discount\":95,\"num\":\"有\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":626,\"discount\":95,\"num\":\"有\"}],\"train_flags\":[\"复兴号\"]},{\"train_no\":\"G133\",\"departure_station\":\"北京南\",\"arrival_station\":\"上海\",\"departure_station_code\":\"VNP\",\"arrival_station_code\":\"SHH\",\"departure_time\":\"11:50\",\"arrival_time\":\"18:02\",\"duration\":\"06:12\",\"enable_booking\":\"Y\",\"prices\":[{\"seat_name\":\"商务座\",\"seat_type_code\":\"9\",\"price\":2019,\"discount\":87,\"num\":\"2\"},{\"seat_name\":\"一等座\",\"seat_type_code\":\"M\",\"price\":1016,\"discount\":95,\"num\":\"无\"},{\"seat_name\":\"二等座\",\"seat_type_code\":\"O\",\"price\":606,\"discount\":91,\"num\":\"无\"},{\"seat_name\":\"无座\",\"seat_type_code\":\"W\",\"price\":606,\"discount\":91,\"num\":\"有\"}],\"train_flags\":[]}],\"error_code\":0}";

        // Json 转换
        TrainScheduleResponseDTO trainScheduleResponseDTO = convertJsonToDto(response.toString());
        System.out.println(convertDtoToJson(trainScheduleResponseDTO));

        return trainScheduleResponseDTO;
    }

    private HashMap<String, String> getStringHashMap(TrainScheduleRequestDTO trainScheduleRequestDTO) {
        HashMap<String, String> map = new HashMap<>();
        map.put("key", juheConfig.getTrainApikey());
        map.put("search_type", trainScheduleRequestDTO.getSearchType());
        map.put("departure_station", trainScheduleRequestDTO.getDepartureStation());
        map.put("arrival_station", trainScheduleRequestDTO.getArrivalStation());
        map.put("date", trainScheduleRequestDTO.getDate());
        map.put("filter", trainScheduleRequestDTO.getFilter());
        map.put("enable_booking", trainScheduleRequestDTO.getEnableBooking());
        map.put("departure_time_range", trainScheduleRequestDTO.getDepartureTimeRange());
        return map;
    }

    private String params(Map<String, String> map) {
        return map.entrySet().stream()
                .map(entry -> {
                    try {
                        return entry.getKey() + "=" + URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString());
                    } catch (Exception e) {
                        return entry.getKey() + "=" + entry.getValue();
                    }
                })
                .collect(Collectors.joining("&"));
    }

    /**
     * 将DTO转换回JSON字符串（用于测试或序列化）
     *
     * @param jsonString
     * @return TrainScheduleResponseDTO
     */
    private TrainScheduleResponseDTO convertJsonToDto(String jsonString) {
        try {
            // 使用FastJSON解析JSON字符串
            return JSON.parseObject(jsonString, TrainScheduleResponseDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("JSON转换失败: " + e.getMessage(), e);
        }
    }

    /**
     * 将DTO转换回JSON字符串（用于测试或序列化）
     *
     * @param jsonString
     * @return TrainScheduleResponseDTO
     */
    private TrainScheduleResponseDTO convertJsonToDtoWithFeatures(String jsonString) {
        try {
            return JSON.parseObject(
                    jsonString,
                    TrainScheduleResponseDTO.class,
                    Feature.AllowUnQuotedFieldNames,
                    Feature.IgnoreNotMatch,
                    Feature.AllowSingleQuotes
            );
        } catch (Exception e) {
            throw new RuntimeException("JSON转换失败: " + e.getMessage(), e);
        }
    }

    // 将DTO转换回JSON字符串（用于测试或序列化）
    private String convertDtoToJson(TrainScheduleResponseDTO dto) {
        return JSON.toJSONString(dto, true); // true表示格式化输出
    }
}
