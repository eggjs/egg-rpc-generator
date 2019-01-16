package {{ namespace }};

import java.util.*;

public interface {{ className }} {
  {%- for method in methods %}
  /**
   * {{ method.description }}
  {%- for request in method.request %}
   * @param {{ request.name }} {{ request.description }}
  {%- endfor %}
   * @return {{ method.response.description }}
   */
  public {{ method.response.name }} {{ method.name }}({% for request in method.request %}{% if loop.index != 1 %}, {% endif %}{{ request.type.names[0] }} {{ request.name }}{% endfor %});
  {% endfor %}
}
