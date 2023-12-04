<!--just perfect classview then copypaste to make raceview
or use components for them to reuse-->

<template>
  <div>
    <h1>Classes</h1>
    <div v-if="isBusy">Loading...</div>
    <div v-else>
      <b-row>
        <b-col v-for="item in dndClasses" :key="item.id" lg="4" md="6" sm="12" class="mb-2">
          <b-card @click="selectCard(item)" :class="{'border-primary': selDndClass.id === item.id}">
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
          <b-button v-b-toggle.sidebar-right variant="primary" @click="showCreateFormModal">
            Create/Edit</b-button>
          <b-button v-b-toggle.sidebar-right variant="danger" @click="showDeleteConfirmModal">
            Delete</b-button>
        </b-button-group>

      </div>

      <!--      MODAL FORM-->
      <b-modal title="Create" ok-variant="ok" cancel-variant="primary"
               @ok="createClass" v-model="boolCreateFormModal">

        <b-form-group class="mb-1" :invalid-feedback="violation.name" :has-err="hasErr.cN">
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.cN">
              <b-icon-people :title="dt.cN" />
            </b-input-group-prepend>

            <b-form-input :has-err="hasErr.cN" :placeholder="dt.cN" v-model="selDndClass.name" trim @keydown="violation.name=null"/>
          </b-input-group>
        </b-form-group>

        <b-form-group class="mb-1" :invalid-feedback="violation.hitDie" :has-err="hasErr.hD" >
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.hD">
              <b-icon-dice2 :title="dt.hD" />
            </b-input-group-prepend>
            <!--            implementing max and mins for hitdie-->
            <b-form-input type="number" :min="cons.hitDieMin" :max="cons.hitDieMax" :placeholder="dt.hD" v-model.number="selDndClass.hitDie" :has-err="hasErr.hD" trim @keydown="violation.hitDie=null" />
          </b-input-group>
        </b-form-group>

        <b-form-group class="mb-1" :invalid-feedback="violation.profChoices" :has-err="hasErr.pC">
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.pC" :has-err="hasErr.pC" trim @keydown="violation.profChoices=null">
              <b-icon-hammer :title="dt.pC" />
            </b-input-group-prepend>

            <b-form-input :placeholder="dt.pC" v-model="selDndClass.profChoices"/>

          </b-input-group>
        </b-form-group>

        <template #modal-cancel>
          <b-icon-stop /> Cancel
        </template>
        <template #modal-ok>
          <b-icon-person-plus-fill />
          {{ selDndClass.id ? 'Edit' : 'Create' }}
        </template>
      </b-modal>

      <b-modal title="Delete Class" ok-variant="danger" cancel-variant="primary"
               @ok="deleteClass" v-model="boolDeleteConfirmModal">
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
        Are you sure you want to delete {{ selDndClass.name }}?
      </b-modal>

    </div>
  </div>

</template>

<script lang="ts">
import {
  Component, Mixins, Prop, Vue,
} from 'vue-property-decorator';
import GlobalMixin from '@/mixins/global-mixin';
import DndClass from '@/models/DndClass';
import { BIcon } from 'bootstrap-vue';

@Component
export default class ClassView extends Mixins(GlobalMixin) {
  // need to set up validation on the selDndClass

  cons ={
    hitDieMin: 4,
    hitDieMax: 14,
  }

  dt = {
    // Display Text - object that stores text to display to the user instead of the attribute names
    cN: 'Class Name',
    hD: 'Hit Die',
    pC: 'Proficiency Choices',
  }

  get hasErr(): any {
    return { // bootstrap hasErrs used to display violation messages
      // true - green border, false - red border, null- regular border
      cN: this.violation.name ? false : null,
      hD: this.violation.hitDie ? false : null,
      pC: this.violation.profChoices ? false : null,
    };
  }

  dndClasses: DndClass[] = [];

  @Prop({ type: Object, validator: (s) => s instanceof Object }) readonly dndClass: any

  selDndClass: DndClass = new DndClass();

  selectCard(item : DndClass) {
    if (this.selDndClass.id === item.id) {
      // clicking on a card selected unselects it
      this.selDndClass = new DndClass();
    } else {
      // click on a card not selected
      // this.tempDndClass = item;
      this.selDndClass = Object.assign(new DndClass(), item);
    }
    console.log(this.selDndClass);
  }

  createClass() {
    console.log(this.selDndClass);
    this.setBusy(true);
    // need to do validation

    // then just send it to the backend db

    this.callAPI(this.CLASS_API, 'POST', this.selDndClass) // returns a promise object
      .then((data) => {
        // determine if the class was added or updated
        this.$emit(this.selDndClass.id === data.id ? 'updated' : 'added', data);
        this.refreshCards();
      })
      .catch((error) => {
        this.violation = error.data || {};
        console.error(error.data[0]);
      })
      .finally(() => {
        this.setBusy(false);
      });
  }

  deleteClass() {
    this.setBusy(true);
    console.log(this.selDndClass);
    this.violation = {};// empty out violation messages

    this.callAPI(`${this.CLASS_API}/${this.selDndClass.id}`, 'delete')
      .then((res) => {
        this.selDndClass = new DndClass();
        // shouldn't need this in this case because the form isn't a child component
        // this.$emit('deleted', this.tempDndClass);
        this.refreshCards();
      })
      .catch((error) => {
        this.violation = error.data || {};
        console.error(error.data[0]);
      })
      .finally(() => {
        this.setBusy(false);
      });
  }

  async refreshCards() {
    await this.fetchFromBackend();
  }

  // getting the data from the backend database
  mounted() {
    this.fetchFromBackend();
  }

  async fetchFromBackend() { // provider does the set busy
    try {
      this.dndClasses = await this.provider(this.CLASS_API);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }
}
</script>
<style scoped>

</style>
<style scoped>

</style>
