<template>
  <div class="home">

    <b-container >
      <b-row class="mb-3">
        <b-col md="12">
          <div class="d-flex align-items-center">
            <div>
              <img alt="DND logo" src="../assets/dnd_logo.png" width="300">
            </div>
            <div class="ml-3">
              <h1>Dnd Character Creator</h1>
              <h4>Please login to begin creating characters</h4>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <b-carousel
      indicators>
      <b-carousel-slide :img-src="require('@/assets/wpwide-castle.jpg')"></b-carousel-slide>
      <b-carousel-slide :img-src="require('@/assets/wpwide-stairs.jpg')"></b-carousel-slide>
      <b-carousel-slide :img-src="require('@/assets/wpwide-dragon.jpg')"></b-carousel-slide>
      <b-carousel-slide :img-src="require('@/assets/wpwide-treebeast.jpg')"></b-carousel-slide>
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
