package com.eggjs.x.common;

import java.io.Serializable;
import java.util.*;

/**
 * HelloError
 */
public class HelloError implements Serializable {
  
  private String name;
  
  private String message;
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public String getMessage() {
    return message;
  }
  
  public void setMessage(String message) {
    this.message = message;
  }
}
