// Don't modified this file, it's auto created by jar2proxy

'use strict';

const path = require('path');

/* eslint-disable */
/* istanbul ignore next */
module.exports = function (app) {
  const appName = '{{ appName }}';
  let version = {{ version | antx}};
  if (app.config.proxy && app.config.proxy.envVersion) {
    version = app.config.proxy.envVersion[appName] || version;
  }
  const rpcClient = app.rpcClient;
  if (!rpcClient) return;
  const consumer = rpcClient.createConsumer({
    interfaceName: '{{ proxyProfile.canonicalName }}',
    version,
    targetAppName: appName,
    group: {{ group | antx }},
    proxyName: '{{ proxyName }}',
    {%- if responseTimeout %}
    responseTimeout: {{ responseTimeout }},
    {%- endif %}
    {%- if startupCheck == false %}
    startupCheck: {{ startupCheck }},
    {%- endif %}
    {%- if errorAsNull != undefined %}
    errorAsNull: {{errorAsNull}},
    {%- endif %}
  });

  {{ proxyProfile.commentText | comment(2) }}
  class {{ proxyProfile.canonicalName | splitLast('.') | upperFirst }} extends app.Proxy {
    constructor(ctx) {
      super(ctx, consumer);
    }
  {%- for item in proxyProfile.methods %}

    // java source code: {{ item.raw }}
    // returnType: {{ item.returnType.canonicalName }}
    {%- if item.commentText %}{{ item.commentText | comment(4) }}{%- endif %}
    async {{ item.methodName }}{%- if item.isOverloading %}${{ item.uniqueId }}{%- endif %}({%- for arg in item.params %}{{ arg.paramName }}{%- if loop.last != true %}, {%- endif %}{%- endfor %}) {
      const args = [
        {%- for arg in item.params %}
        {
          $class: '{{ arg.canonicalName }}',
          $: {{ arg.paramName }},
          {%- if arg.abstractClass %}
          $abstractClass: '{{ arg.canonicalName }}',
          {%- endif %}
          {%- if arg.generic %}
          generic: {{ arg.generic | stringify }},
          {%- endif %}
          {%- if arg.isEnum %}
          isEnum: true,
          {%- endif %}
          {%- if arg.isArray %}
          isArray: true,
          {%- endif %}
        }{%- if loop.last != true %},{%- endif %}
        {%- endfor %}
      ];
      return await consumer.invoke('{{ item.methodName }}', args, {
        ctx: this.ctx,
        {%- if item.extConfig.responseTimeout %}
        responseTimeout: {{ item.extConfig.responseTimeout }},
        {%- endif %}
      });
    }
  {%- endfor %}
  }
  return {{ proxyProfile.canonicalName | splitLast('.') | upperFirst }};
};

/* eslint-enable */

