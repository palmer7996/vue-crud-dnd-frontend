<!--just perfect classview then copypaste to make raceview
or use components for them to reuse-->

<template>
  <div>
    <h1>Classes</h1>
    <div v-if="isBusy">Loading...</div>
    <div v-else class="mb-5">
      <b-row>
        <b-col v-for="item in dndClasses" :key="item.id" lg="4" md="6" sm="12" class="mb-2">
          <b-card @click="selectCard(item)" :class="{'border-primary': selDndClass.id === item.id}">
            <b-card-body >

              <h4 class="card-text">{{ item.name }}</h4>
              <p class="card-text">Hit Die: {{ item.hitDie }}</p>
              <p class="card-text">Proficiency: {{ item.profChoices }}</p>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <div>
        <b-button-group class="fixed-bottom d-flex justify-content-between">
          <b-button v-b-toggle.sidebar-right :variant="btnTypeSubmit" @click="showCreateFormModal(true)">
            {{ boolDisplayCreateOrEdit ? "Create" : "Edit" }}</b-button>
          <b-button v-b-toggle.sidebar-right :variant="btnTypeDelete" @click="showDeleteConfirmModal(true)">
            Delete</b-button>
        </b-button-group>
      </div>

      <!--      MODAL FORM-->
      <b-modal title="Create" :ok-variant="btnTypeSubmit" :cancel-variant="btnTypeCancel"
               @ok="createClass" v-model="boolCreateFormModal" ref="createModal" >

        <b-form-group class="mb-1" :invalid-feedback="violation.name" :state="hasErr.cN" >
          <!--        :state="violation.name ? false : null"-->
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.cN">
              <b-icon-people :title="dt.cN" />
            </b-input-group-prepend>

            <b-form-input :state="hasErr.cN" :placeholder="dt.cN" v-model="selDndClass.name" trim @keydown="violation.name=null"/>
          </b-input-group>
        </b-form-group>

        <b-form-group class="mb-1" :invalid-feedback="violation.hitDie" :state="hasErr.hD" >
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.hD">
              <b-icon-dice2 :title="dt.hD" />
            </b-input-group-prepend>
            <!--            implementing max and mins for hitdie-->
            <b-form-input type="number" :placeholder="dt.hD" v-model.number="selDndClass.hitDie" :state="hasErr.hD" trim @keydown="violation.hitDie=null"/>
          </b-input-group>
        </b-form-group>

        <b-form-group class="mb-1" :invalid-feedback="violation.profChoices" :state="hasErr.pC">
          <b-input-group>
            <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.pC" >
              <b-icon-hammer :title="dt.pC" />
            </b-input-group-prepend>

            <b-form-input :placeholder="dt.pC" v-model="selDndClass.profChoices" :state="hasErr.pC" trim @keydown="violation.profChoices=null"/>

          </b-input-group>
        </b-form-group>

        <template #modal-cancel>
          <b-icon-x-octagon-fill /> Cancel
        </template>
        <template #modal-ok>
          <b-icon-person-plus-fill />
          {{ selDndClass.id ? 'Edit' : 'Create' }}
        </template>
      </b-modal>

      <b-modal title="Delete Class" :ok-variant="btnTypeDelete" :cancel-variant="btnTypeCancel"
               @ok="deleteClass" v-model="boolDeleteConfirmModal">
        <template #modal-cancel>
          <b-icon-x-octagon-fill /> Cancel
        </template>
        <template #modal-ok>
          <b-icon-exclamation-triangle-fill /> Delete
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
import { validate, ValidationError } from 'class-validator';
import ViolationDndClass from '@/models/ViolationDndClass';
import { BvModalEvent } from 'bootstrap-vue';

@Component
export default class ClassView extends Mixins(GlobalMixin) {
  // @Prop({ type: DndClass, validator: (s) => s instanceof DndClass }) selDndClass!: DndClass

  // need to set up validation on the selDndClass
  violation = new ViolationDndClass();
  // violation : any = {};

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
  // replaced all has-err with :state="hasErr.hD"
  // could also work as the below
  // :state="violation.name ? false : null"

  dndClasses: DndClass[] = [];

  selDndClass: DndClass = new DndClass();

  selectCard(item : DndClass) {
    // clear violations
    this.violation = new ViolationDndClass();
    if (this.selDndClass.id === item.id) {
      // clicking on a card selected unselects it
      this.selDndClass = new DndClass();
      this.toggleCreateOrEdit(true);
    } else {
      // click on a card not selected
      // this.tempDndClass = item;
      this.selDndClass = Object.assign(new DndClass(), item);
      this.toggleCreateOrEdit(false);
    }
    console.log(this.selDndClass);
  }

  async validateClass(selClass : DndClass): Promise<boolean> {
    // Reset violation to get rid of displayed errors for now
    this.violation = new ViolationDndClass();

    // validate data before sending fetch request
    const errors = await validate(this.selDndClass);
    console.log('This is from the validate method:');
    console.log(errors);
    if (errors.length > 0) {
      const temp = new ViolationDndClass();
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

  async createClass(event : BvModalEvent) {
    event.preventDefault();// want to keep the modal up, didn't work when called inside the if

    console.log(this.selDndClass);

    // need to do validation
    if (!await this.validateClass(this.selDndClass)) {
      console.log('validation failed');
      return;
    }
    // then just send it to the backend db
    // after adjusting api can just do a post for edits and creates for ClassView and RaceView

    this.callAPI(this.CLASS_API, 'POST', this.selDndClass) // returns a promise object
      .then((data) => {
        const addOrUpdate = this.selDndClass.id === data.id ? 'update' : 'add';
        if (addOrUpdate === 'update') {
          // update
          this.handleUpdate(this.dndClasses, this.selDndClass);
        } else {
          // addition won't work properly with selection
          this.refreshCards();
          // this.dndClasses.unshift(this.selDndClass);
        }
      })
      .catch((error) => {
        this.violation = error.data || new ViolationDndClass();
        console.error(error.data[0]);
      })
      .finally(() => {
        // remove edit button and deselect
        this.toggleCreateOrEdit(true);
        // clear form
        this.selDndClass = new DndClass();
        this.showCreateFormModal(false); // hide the modal manually because we prevented default to show error message
      });
  }

  deleteClass() {
    // this.setBusy(true);
    console.log(this.selDndClass);
    this.violation = new ViolationDndClass();// empty out violation messages
    const classId = this.selDndClass.id;
    this.callAPI(`${this.CLASS_API}/${classId}`, 'delete')
      .then((res) => {
        this.handleDelete(this.dndClasses, classId);
        this.selDndClass = new DndClass();
      })
      .catch((error) => {
        this.violation = error.data || ViolationDndClass;
        console.error(error.data[0]);
      })
      .finally(() => {
        // remove edit button and deselect
        this.toggleCreateOrEdit(true);
        // this.setBusy(false);
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
