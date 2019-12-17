Vue.component('nodebase-inspector', {
    // 修改组件在 inspector 的显示样式
    template: `
    <ui-prop v-prop="target.events.value"></ui-prop>
    `,
  
    props: {
      target: {
        twoWay: true,
        type: Object,
      },
    },
  });