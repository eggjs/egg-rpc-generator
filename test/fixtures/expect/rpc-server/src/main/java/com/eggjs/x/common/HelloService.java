package com.eggjs.x.common;

import java.util.*;

public interface HelloService {
  /**
   * send 接口
   * @param req 请求对象
   * @return 返回对象
   */
  public Response send(Request req);
  
  /**
   * 范型响应接口
   * @param req 请求对象
   * @return 
   */
  public GenericResult<List<HelloResponse>,HelloError> sendGenericResult(Request req);
  
}
