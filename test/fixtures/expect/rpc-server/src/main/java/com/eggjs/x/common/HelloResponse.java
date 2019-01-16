package com.eggjs.x.common;

import java.io.Serializable;
import java.util.*;

/**
 * HelloResponse
 */
public class HelloResponse implements Serializable {
  
  private String hello;
  
  public String getHello() {
    return hello;
  }
  
  public void setHello(String hello) {
    this.hello = hello;
  }
}
