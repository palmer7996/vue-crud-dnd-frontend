<!--just perfect classview then copypaste to make raceview
or use components for them to reuse-->

<template>
  <div>
    <h1>Classes</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <b-row>
        <b-col v-for="item in dndClasses" :key="item.id" lg="4" md="6" sm="12" class="mb-2">
          <b-card style="max-width: 20rem;" @click="selectCard(item)" :class="{'selected-card': tempDndClass.name === item.name}">
            <b-card-body >
              <p class="card-text">Name: {{ item.name }}</p>
              <p class="card-text">hitDie: {{ item.hitDie }}</p>
              <p class="card-text">proficiency: {{ item.profChoices }}</p>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <div>
        <b-button-group class="fixed-bottom d-flex justify-content-between">
          <b-button v-b-toggle.sidebar-right variant="primary" @click="showClassForm">
            Create/Edit</b-button>
          <b-button v-b-toggle.sidebar-right variant="danger" @click="deleteConfirm">
            Delete</b-button>
        </b-button-group>

      </div>

      <!--      MODAL FORM-->
      <b-modal title="Create" ok-variant="ok" cancel-variant="primary"
               @ok="createClass" v-model="showCreateModal">

        <b-form-group class="mb-1">
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.cN">
              <b-icon-people :title="dt.cN" />
            </b-input-group-prepend>

            <b-form-input :placeholder="dt.cN" v-model="tempDndClass.name"/>
          </b-input-group>
        </b-form-group>

        <b-form-group class="mb-1">
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.hD">
              <b-icon-dice2 :title="dt.hD" />
            </b-input-group-prepend>
            <!--            implementing max and mins for hitdie-->
            <b-form-input type="number" :min="hitDieMin" :max="hitDieMax" :placeholder="dt.hD" v-model.number="tempDndClass.hitDie"/>
          </b-input-group>
        </b-form-group>

        <b-form-group class="mb-1">
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.pC">
              <b-icon-hammer :title="dt.pC" />
            </b-input-group-prepend>

            <b-form-input :placeholder="dt.pC" v-model="tempDndClass.profChoices"/>

          </b-input-group>
        </b-form-group>

        <template #modal-cancel>
          <b-icon-stop /> Cancel
        </template>
        <template #modal-ok>
          <b-icon-person-plus-fill /> {{ tempDndClass.id ? 'Edit' : 'Create' }}
        </template>
      </b-modal>

      <b-modal title="Delete Student" ok-variant="danger" cancel-variant="primary"
               @ok="deleteClass" v-model="showConfirmDeleteModal">
        <!--    using slots -- https://vuejs.org/v2/guide/components-slots.html
          slot defined in b-modal -- https://bootstrap-vue.org/docs/components/modal#comp-ref-b-modal-slots
          modify the buttons that appear in the footer of the modal using pre-defined slots-->
        <template #modal-cancel>
          <!-- add a X icon to the cancel button-->
          <b-icon-stop /> Cancel
        </template>

        <template #modal-ok>
          <!-- change the OK button to say Delete instead and add a trash can icon-->
          <b-icon-person-x-fill /> Delete
        </template>
        Are you sure you want to delete {{tempDndClass.name}}?
      </b-modal>

    </div>
  </div>

</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';
import GlobalMixin from '@/mixins/global-mixin';
import DndClass from '@/models/DndClass';
import Student from '@/models/Student';
import { BIcon } from 'bootstrap-vue';

@Component
export default class ClassView extends Mixins(GlobalMixin) {
  hitDieMin = 4;

  hitDieMax = 14;

  loading = true;

  showCreateModal = false

  showConfirmDeleteModal = false;

  dt = {
    // Display Text - object that stores text to display to the user instead of the attribute names
    cN: 'Class Name',
    hD: 'Hit Die',
    pC: 'Proficiency Choices',
  }

  dndClasses: DndClass[] = [];

  tempDndClass: DndClass = new DndClass();

  violation: any = {}

  selectCard(item : DndClass) {
    if (this.tempDndClass.name === item.name) {
      // clicking on a card selected unselects it
      this.tempDndClass = new DndClass();
    } else {
      // click on a card not selected
      // this.tempDndClass = item;
      this.tempDndClass = Object.assign(new DndClass(), item);
    }
    console.log(this.tempDndClass);
    console.log(this.userData);
  }

  showClassForm() {
    this.showCreateModal = true;
  }

  createClass() {
    console.log(this.tempDndClass);
    this.violation = {};
    // need to do validation

    // then just send it to the backend db

    this.callAPI(this.CLASS_API, 'POST', this.tempDndClass) // returns a promise object
      .then((data) => {
        // determine if the class was added or updated
        this.$emit(this.tempDndClass.id === data.id ? 'updated' : 'added', data);
        this.refreshDndClasses();
      })
      .catch((error) => {
        // get the violation messages from the api - if the web server responded
        console.log(error.data[0]?.constraints);
        this.violation = error.data || {};
      })
      .finally(() => {
        this.setBusy(false);// tell parent that this component is no longer waiting for the api
      });
  }

  deleteConfirm() {
    this.showConfirmDeleteModal = true;
  }

  deleteClass() {
    console.log(this.tempDndClass);
    this.setBusy(true);// tell parent that this component is waiting for the api
    this.violation = {};// empty out violation messages
    this.callAPI(`${this.CLASS_API}/${this.tempDndClass.id}`, 'delete')
      .then((res) => {
        this.tempDndClass = new DndClass();
        this.$emit('deleted', this.tempDndClass);// tell parent student was deleted
        this.refreshDndClasses();
      })
      .catch((error) => {
        console.error(error.data[0]?.constraints);
        // this.$emit('reset', this.tempDndClass);
      })
      .finally(() => {
        this.setBusy(false);// tell parent that this component is no longer waiting for the api
      });
  }

  async refreshDndClasses() {
    await this.fetchFromBackend();
  }

  // getting the data from the backend database
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
.selected-card {
  border: 2px solid blue; /* Add your preferred styling for the selected card */
}
</style>
