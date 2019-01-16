package com.eggjs.x.common;

import java.io.Serializable;
import java.util.*;

/**
 * Sub 对象
 */
public class Sub implements Serializable {
  // 名字
  private String name;
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
}
