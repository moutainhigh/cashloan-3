package com.rongdu.cashloan.cl.service;


import com.rongdu.cashloan.cl.domain.ClFlowUV;
import com.rongdu.cashloan.core.common.service.BaseService;

import java.util.List;
import java.util.Map;

/**
 * 流量平台uv统计Service
 * 
 * @author
 * @version 1.0.0
 * @date 2017-11-15 13:32:13
 * Copyright 杭州民华金融信息服务有限公司  cashloan All Rights Reserved
 * 官方网站：www.yongqianbei.com
 * 未经授权不得进行修改、复制、出售及商业使用
 */
public interface ClFlowUVService extends BaseService<ClFlowUV, Long> {

    List<ClFlowUV> getAllFlowUv(Map<String,Object> params ) throws Exception;

    Long getPreviousMonthClick(Map param);

    ClFlowUV getClFlowUVByDate(Map<String,Object> params);

    Integer queryNumberPlat(Map<String,Object> params);

    List<ClFlowUV> listFlowUv();
}
