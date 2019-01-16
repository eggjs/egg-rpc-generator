package com.eggjs;

import java.util.*;

public interface FooService {
  /**
   * 获取用户信息
   * @param login 用户域账号
   * @return 完整用户信息
   */
  public Map getUser(String login);
  
  /**
   * [*testType description]
   * @param i [description]
   * @param it [description]
   * @param n [description]
   * @param bl [description]
   * @param b [description]
   * @param l [description]
   * @param s [description]
   * @param o [description]
   * @param map [description]
   * @param array [description]
   * @param list [description]
   * @return [description]
   */
  public String testType(Integer i, Integer it, double n, Boolean bl, Boolean b, Long l, String s, Map o, Map map, List array, List list);
  
}
