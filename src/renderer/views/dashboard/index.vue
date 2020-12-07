<template>
  <div class="dashboard-container">
    <!-- <iframe v-bind:src="mapUrl" frameborder="0" scrolling="auto" style="width:100%;height:calc(100vh - 88px);margin-top:-10px;margin-left:-5px;"></iframe> -->
    <div class="dashboard-text">首页可以展示统计信息，待开发...</div>
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      mapUrl: 'http://www.baidu.com'
    }
  },
  mounted() {
    console.log("process.env.VUE_APP_BASE_APIL...",process.env.VUE_APP_BASE_API)
    console.log("process.env.VUE_APP_MAP_URL...",process.env.VUE_APP_MAP_URL)
    this.mapUrl = process.env.VUE_APP_MAP_URL
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    // margin: 30px;
    margin: 0;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
