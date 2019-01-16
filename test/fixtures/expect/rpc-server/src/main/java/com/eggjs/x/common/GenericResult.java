package com.eggjs.x.common;

import java.io.Serializable;
import java.util.*;

/**
 * GenericResult
 */
public class GenericResult<T, U> implements Serializable {
  
  private T result;
  
  private Boolean success;
  
  private U error;
  
  public T getResult() {
    return result;
  }
  
  public void setResult(T result) {
    this.result = result;
  }
  
  public Boolean isSuccess() {
    return success;
  }
  
  public void setSuccess(Boolean success) {
    this.success = success;
  }
  
  public U getError() {
    return error;
  }
  
  public void setError(U error) {
    this.error = error;
  }
}
