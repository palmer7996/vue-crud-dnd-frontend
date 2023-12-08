<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/dnd_logo.png" width="400">
    <!--    <img alt="Vue logo" src="../assets/117898.jpg">-->
    <h1>Dnd Character Creator</h1>
    <h4>Please login to begin creating characters</h4>
    <b-carousel controls
                indicators>
      <b-carousel-slide :img-src="require('@/assets/117898.jpg')"></b-carousel-slide>
      <b-carousel-slide :img-src="require('@/assets/117899.jpg')"></b-carousel-slide>
      <b-carousel-slide :img-src="require('@/assets/117900.jpg')"></b-carousel-slide>
      <b-carousel-slide :img-src="require('@/assets/117901.jpg')"></b-carousel-slide>
      <b-carousel-slide :img-src="require('@/assets/117908.jpg')"></b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';
import GlobalMixin from '@/mixins/global-mixin'; // @ is an alias to /src

@Component({
  components: {
  },
})
export default class HomeView extends Mixins(GlobalMixin) {

}
</script>
