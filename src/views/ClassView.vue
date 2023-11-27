<!--just perfect classview then copypaste to make raceview
or use components for them to reuse-->

<template>
  <div>
    <h1>Classes</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <b-row>
        <b-col v-for="item in dndClasses" :key="item.id" lg="4" md="6" sm="12" class="mb-2">
          <b-card style="max-width: 20rem;" @click="selectedClass= $event" >
            <!--            @click="logSelectedClass(item)"-->
            <b-card-body >
              <p class="card-text">Name: {{ item.name }}</p>
              <p class="card-text">hitDie: {{ item.hitDie }}</p>
              <p class="card-text">proficiency: {{ item.profChoices }}</p>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <b-button v-b-toggle.sidebar-right variant="primary" class="fixed-button">
        Open</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';
import GlobalMixin from '@/mixins/global-mixin';
import DndClass from '@/models/DndClass';
import Student from '@/models/Student';

@Component
export default class Product extends Mixins(GlobalMixin) {
  // data variable
  selectedClass:DndClass = new DndClass()

  logSelectedClass(selectedItem: DndClass) { // for testing, it works
    console.log('Selected Class:', selectedItem);
  }

  loading = true;

  dndClasses: DndClass[] = [];

  mounted() {
    this.fetchFromBackend();
  }

  async fetchFromBackend() {
    try {
      this.dndClasses = await this.provider();
      this.loading = false;
    } catch (error) {
      console.error('Error fetching classes:', error);
      this.loading = false;
    }
  }

  async provider(): Promise<any> { // make this DndClass instead of any later
    // fetch from the backend prj3 server use the variable set in globalmixins
    const res = await fetch(this.CLASS_API);
    // const res = await fetch('http://localhost:3004/info/classes');

    return res.json();
    // return fetch('http://localhost:3006/products').then((res) => res.json());
  }
}
</script>
<style scoped>
/* Add custom styling for the fixed button */
.fixed-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
