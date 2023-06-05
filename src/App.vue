<script lang="tsx">
import { ElInput } from 'element-plus';

import { chatCompletions } from './api';

export default {
  render() {
    return (
      <div class="app">
        <div class="content"></div>
        <div class="input padding-base">
          <ElInput style="width: 100%;" type="textarea" rows={10} />
        </div>
      </div>
    );
  },
  mounted() {
    //chatCompletions('test1', 'Hello World!');
  },
};
</script>

<style lang="scss" scoped>
.app {
  .msgbox {
  }
  .input {
  }
}
</style>
