package com.febuki.tool.server.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.entity.Traveler;
import com.febuki.tool.server.mapper.TraverlerMapper;
import com.febuki.tool.server.service.TravelerServer;
import org.springframework.stereotype.Service;

@Service("TravelerServer")
public class TravelerServerImpl extends ServiceImpl<TraverlerMapper, Traveler> implements TravelerServer {
}
