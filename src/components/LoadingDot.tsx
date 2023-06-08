import { defineComponent, onBeforeMount, onMounted, ref } from 'vue';

export default defineComponent({
  setup() {
    const dots = ref('.');

    const start = () =>
      setInterval(() => {
        if (dots.value.length >= 10) {
          dots.value = '.';
        } else {
          dots.value += '.';
        }
      }, 500);

    let interval;

    onMounted(() => {
      interval = start();
    });

    onBeforeMount(() => {
      clearInterval(interval);
      interval = null;
    });

    return () => dots.value;
  },
});
