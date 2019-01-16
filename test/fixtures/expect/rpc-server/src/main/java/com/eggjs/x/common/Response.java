package com.eggjs.x.common;

import java.io.Serializable;
import java.util.*;

/**
 * 响应对象
 */
public class Response implements Serializable {
  
  private Map<String, String> result;
  // 响应状态
  private Integer resultStatus;
  
  public Map<String, String> getResult() {
    return result;
  }
  
  public void setResult(Map<String, String> result) {
    this.result = result;
  }
  
  public Integer getResultStatus() {
    return resultStatus;
  }
  
  public void setResultStatus(Integer resultStatus) {
    this.resultStatus = resultStatus;
  }
}
