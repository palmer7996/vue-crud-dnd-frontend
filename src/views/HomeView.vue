<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>Dnd Character Creator</h1>
    <!--    <HelloWorld msg="Dnd Character Creator"/>-->
    <!--    <IconButton icon="discord" @party="showMessage('THIS IS FUN')"
                animation-style="spin" :animate="true">
      Anther Fun Button</IconButton>-->

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
  // eslint-disable-next-line class-methods-use-this
  showMessage(msg:string):void {
    alert(msg);
  }
}
</script>
