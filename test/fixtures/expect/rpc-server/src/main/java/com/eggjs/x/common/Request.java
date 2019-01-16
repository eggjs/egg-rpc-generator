package com.eggjs.x.common;

import java.io.Serializable;
import java.util.*;

/**
 * 请求对象
 */
public class Request implements Serializable {
  // 名字
  private String name;
  // 子对象
  private Map<String, Sub> obj;
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public Map<String, Sub> getObj() {
    return obj;
  }
  
  public void setObj(Map<String, Sub> obj) {
    this.obj = obj;
  }
}
