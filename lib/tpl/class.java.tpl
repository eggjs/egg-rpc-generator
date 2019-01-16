package {{ namespace }};

import java.io.Serializable;
import java.util.*;

/**
 * {{ description }}
 */
public class {{ name }} implements Serializable {

  {%- for item in properties %}
  {% if item.description %}// {{ item.description | trim }}{% endif %}
  private {{ item.type.type }} {{ item.name }};{%- endfor%}
  {%- for item in properties %}
  {% if item.type.type == 'Boolean' %}
  public {{ item.type.type }} is{{ item.name.slice(0, 1) | upper }}{{ item.name.slice(1) }}() {
    return {{ item.name }};
  }
  {% else %}
  public {{ item.type.type }} get{{ item.name.slice(0, 1) | upper }}{{ item.name.slice(1) }}() {
    return {{ item.name }};
  }
  {% endif %}
  public void set{{ item.name.slice(0, 1) | upper }}{{ item.name.slice(1) }}({{ item.type.type }} {{ item.name }}) {
    this.{{ item.name }} = {{ item.name }};
  }
  {%- endfor%}
}
