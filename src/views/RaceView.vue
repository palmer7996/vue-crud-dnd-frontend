<template>
  <div>
    <h1>Races</h1>
    <div v-if="isBusy">Loading...</div>
    <div v-else>
      <b-row>
        <b-col v-for="item in dndRaces" :key="item.id" lg="4" md="6" sm="12" class="mb-2">
          <b-card @click="selectCard(item)" :class="{'border-primary': selDndRace.id === item.id}">
            <b-card-body >
              <p class="card-text">Name: {{ item.name }}</p>
              <p class="card-text">Speed: {{ item.speed }}</p>
              <p class="card-text">abilityScoreType: {{ item.abilityScoreType }}</p>
              <p class="card-text">abilityScoreBonus: {{ item.abilityScoreBonus }}</p>
              <p class="card-text">ageDesc: {{ item.ageDesc }}</p>
              <p class="card-text">alignmentDesc: {{ item.alignmentDesc }}</p>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <div>
        <b-button-group class="fixed-bottom d-flex justify-content-between">
          <b-button v-b-toggle.sidebar-right variant="primary" @click="showCreateFormModal(true)">
            Create/Edit</b-button>
          <b-button v-b-toggle.sidebar-right variant="danger" @click="showDeleteConfirmModal(true)">
            Delete</b-button>
        </b-button-group>
      </div>

      <!--      MODAL FORM-->
      <b-modal title="Create" ok-variant="ok" cancel-variant="primary"
               @ok="createRace" v-model="boolCreateFormModal" ref="createModal" >

        <b-form-group class="mb-1" :invalid-feedback="violation.name" :state="hasErr.rN" >
          <!--        :state="violation.name ? false : null"-->
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.rN">
              <b-icon-people :title="dt.rN" />
            </b-input-group-prepend>

            <b-form-input :state="hasErr.rN" :placeholder="dt.rN" v-model="selDndRace.name" trim @keydown="violation.name=null"/>
          </b-input-group>
        </b-form-group>

        <b-form-group class="mb-1" :invalid-feedback="violation.speed" :state="hasErr.sP" >
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.sP">
              <b-icon-dice2 :title="dt.sP" />
            </b-input-group-prepend>
            <!--            implementing max and mins for hitdie-->
            <b-form-input type="number" :placeholder="dt.sP" v-model.number="selDndRace.speed" :state="hasErr.sP" trim @keydown="violation.speed=null"/>
          </b-input-group>
        </b-form-group>

        <b-form-group class="mb-1" :invalid-feedback="violation.abilityScoreType" :state="hasErr.sT">
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.sT" >
              <b-icon-hammer :title="dt.sT" />
            </b-input-group-prepend>
            <!--            no keydown = null just so user can see the options-->
            <b-form-input :placeholder="dt.sT" v-model="selDndRace.abilityScoreType" :state="hasErr.sT" trim/>

          </b-input-group>
        </b-form-group>

        <b-form-group class="mb-1" :invalid-feedback="violation.abilityScoreBonus" :state="hasErr.sB" >
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.sB">
              <b-icon-dice3 :title="dt.sB" />
            </b-input-group-prepend>
            <b-form-input type="number" :placeholder="dt.sB" v-model.number="selDndRace.abilityScoreBonus" :state="hasErr.sB" trim @keydown="violation.abilityScoreBonus=null"/>
          </b-input-group>
        </b-form-group>

        <b-form-group class="mb-1" :invalid-feedback="violation.ageDesc" :state="hasErr.aG">
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.aG" >
              <b-icon-person-lines-fill :title="dt.aG" />
            </b-input-group-prepend>

            <b-form-input :placeholder="dt.aG" v-model="selDndRace.ageDesc" :state="hasErr.aG" trim @keydown="violation.ageDesc=null" />

          </b-input-group>
        </b-form-group>

        <b-form-group class="mb-1" :invalid-feedback="violation.alignmentDesc" :state="hasErr.aL">
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.aL" >
              <b-icon-person-lines-fill :title="dt.aL" />
            </b-input-group-prepend>

            <b-form-input :placeholder="dt.aL" v-model="selDndRace.alignmentDesc" :state="hasErr.aL" trim @keydown="violation.alignmentDesc=null"/>

          </b-input-group>
        </b-form-group>

        <template #modal-cancel>
          <b-icon-x-octagon-fill /> Cancel
        </template>
        <template #modal-ok>
          <b-icon-person-plus-fill />
          {{ selDndRace.id ? 'Edit' : 'Create' }}
        </template>
      </b-modal>

      <b-modal title="Delete Race" ok-variant="danger" cancel-variant="primary"
               @ok="deleteRace" v-model="boolDeleteConfirmModal">
        <!--    using slots -- https://vuejs.org/v2/guide/components-slots.html
  slot defined in b-modal -- https://bootstrap-vue.org/docs/components/modal#comp-ref-b-modal-slots
  modify the buttons that appear in the footer of the modal using pre-defined slots-->
        <template #modal-cancel>
          <!-- add a X icon to the cancel button-->
          <b-icon-x-octagon-fill /> Cancel
        </template>

        <template #modal-ok>
          <!-- change the OK button to say Delete instead and add a trash can icon-->
          <b-icon-exclamation-triangle-fill /> Delete
        </template>
        Are you sure you want to delete {{ selDndRace.name }}?
      </b-modal>

    </div>
  </div>

</template>

<script lang="ts">
import {
  Component, Mixins, Prop, Vue,
} from 'vue-property-decorator';
import GlobalMixin from '@/mixins/global-mixin';
import DndRace from '@/models/DndRace';
import { validate, ValidationError } from 'class-validator';
import ViolationDndRace from '@/models/ViolationDndRace';
import { BvModalEvent } from 'bootstrap-vue';

@Component
export default class RaceView extends Mixins(GlobalMixin) {
  // @Prop({ type: DndRace, validator: (s) => s instanceof DndRace }) selDndRace!: DndRace

  // need to set up validation on the selDndRace
  violation = new ViolationDndRace();
  // violation : any = {};

  dt = {
    // Display Text - object that stores text to display to the user instead of the attribute names
    rN: 'Race Name',
    sP: 'Speed',
    sT: 'Ability Score Type',
    sB: 'Ability Score Bonus',
    aG: 'Age Description',
    aL: 'Alignment Description',
  }

  get hasErr(): any {
    return { // bootstrap hasErrs used to display violation messages
      // true - green border, false - red border, null- regular border
      rN: this.violation.name ? false : null,
      sP: this.violation.speed ? false : null,
      sT: this.violation.abilityScoreType ? false : null,
      sB: this.violation.abilityScoreBonus ? false : null,
      aG: this.violation.ageDesc ? false : null,
      aL: this.violation.alignmentDesc ? false : null,
    };
  }
  // replaced all has-err with :state="hasErr.hD"
  // could also work as the below
  // :state="violation.name ? false : null"

  dndRaces: DndRace[] = [];

  selDndRace: DndRace = new DndRace();

  selectCard(item : DndRace) {
    // clear violations
    this.violation = new ViolationDndRace();
    if (this.selDndRace.id === item.id) {
      // clicking on a card selected unselects it
      this.selDndRace = new DndRace();
    } else {
      // click on a card not selected
      // this.tempDndRace = item;
      this.selDndRace = Object.assign(new DndRace(), item);
    }
    console.log(this.selDndRace);
  }

  async validateRace(selRace : DndRace): Promise<boolean> {
    // Reset violation to get rid of displayed errors for now
    this.violation = new ViolationDndRace();

    // validate data before sending fetch request
    const errors = await validate(selRace);
    console.log('This is from the validate method:');
    console.log(errors);
    if (errors.length > 0) {
      const temp = new ViolationDndRace();
      errors.forEach((vio: ValidationError) => {
        Object.assign(temp, {
          [vio.property]: vio.constraints![Object.keys(vio.constraints!)[0]],
        });
      });

      console.log(temp);
      this.violation = temp;
      return false;
    }
    return true;
  }

  async createRace(event : BvModalEvent) {
    event.preventDefault();// want to keep the modal up, didn't work when called inside the if

    console.log(this.selDndRace);

    // need to do validation
    if (!await this.validateRace(this.selDndRace)) {
      console.log('validation failed');
      return;
    }
    this.setBusy(true);
    // then just send it to the backend db

    this.callAPI(this.RACE_API, 'POST', this.selDndRace) // returns a promise object
      .then((data) => {
        // determine if the race was added or updated
        this.$emit(this.selDndRace.id === data.id ? 'updated' : 'added', data);
        this.refreshCards();
      })
      .catch((error) => {
        this.violation = error.data || new ViolationDndRace();
        console.error(error.data[0]);
      })
      .finally(() => {
        this.setBusy(false);
        this.showCreateFormModal(false); // hide the modal manually because we prevented default to show error message
      });
  }

  deleteRace() {
    this.setBusy(true);
    console.log(this.selDndRace);
    this.violation = new ViolationDndRace();// empty out violation messages

    this.callAPI(`${this.RACE_API}/${this.selDndRace.id}`, 'delete')
      .then((res) => {
        this.selDndRace = new DndRace();
        // shouldn't need this in this case because the form isn't a child component
        // this.$emit('deleted', this.tempDndRace);
        this.refreshCards();
      })
      .catch((error) => {
        this.violation = error.data || ViolationDndRace;
        console.error(error.data[0]);
      })
      .finally(() => {
        this.setBusy(false);
      });
  }

  // getting the data from the backend database
  async refreshCards() {
    await this.fetchFromBackend();
  }

  mounted() {
    this.fetchFromBackend();
  }

  async fetchFromBackend() { // provider does the set busy
    try {
      this.dndRaces = await this.provider(this.RACE_API);
    } catch (error) {
      console.error('Error fetching Races:', error);
    }
  }
}
</script>
<style scoped>

</style>
<style scoped>

</style>
