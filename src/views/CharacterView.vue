<template>
  <div>
    <h1>Characters </h1>
    <h2>Total: {{count}}</h2>
    <div v-if="isBusy">Loading...</div>
    <div v-else>
      <b-row>
        <b-col v-for="item in dndCharacters" :key="item.id" lg="6" md="6" sm="12" class="mb-2">
          <b-card @click="selectCard(item)" :class="{'border-primary': selCharacter.id === item.id}">
            <b-card-body >
              <h4 class="mb-4 font-weight-bold">{{ item.name }}</h4>
              <p class="card-text">(Owner by user with the id: {{ item.userId }})</p>
              <!-- Details in columns -->
              <b-row>
                <b-col md="6">
                  <p class="card-text">Age: {{ item.age }}</p>
                  <p class="card-text">Gender: {{ item.gender }}</p>
                  <p class="card-text">Date Created: {{ formatDate(item.dateCreated) }}</p>
                </b-col>
                <b-col md="6">
                  <p class="card-text">Class: {{ item.class }}</p>
                  <p class="card-text">Race: {{ item.race }}</p>
                  <p class="card-text">Alignment: {{ item.alignment }}</p>

                </b-col>
              </b-row>

              <p class="card-text my-3" v-if="item.description">Description: {{ item.description }}</p>

              <!-- display stats only if it has an attribute -->
              <b-row>
                <b-col md="6">
                  <p class="card-text" v-if="item.strength">Strength: {{ item.strength }}</p>
                  <p class="card-text" v-if="item.dexterity">Dexterity: {{ item.dexterity }}</p>
                  <p class="card-text" v-if="item.constitution">Constitution: {{ item.constitution }}</p>
                </b-col>
                <b-col md="6">
                  <p class="card-text" v-if="item.intelligence">Intelligence: {{ item.intelligence }}</p>
                  <p class="card-text" v-if="item.wisdom">Wisdom: {{ item.wisdom }}</p>
                  <p class="card-text" v-if="item.charisma">Charisma: {{ item.charisma }}</p>
                </b-col>
              </b-row>

              <!--              implement the rest of them-->
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

      <!--      MODAL FORM using hide footer to hide the ok and cancel from the modal, instead using the buttons in the child characterForm to allow for easy emitting-->
      <!--      closeModal and childSavesCharacter function as the alternatives for the ok and cancel-->
      <b-modal title="Create" v-model="boolCreateFormModal" hide-footer>
        <CharacterForm debug
                       :character="selCharacter" :disabled="isDisabled" @busy="setBusy" :violation="violation"
                       @closeModal="showCreateFormModal(false)" @childSaveCharacter="saveCharacterFromChild($event)"/>
      </b-modal>

      <b-modal title="Delete Character" ok-variant="danger" cancel-variant="primary"
               @ok="deleteCharacter" v-model="boolDeleteConfirmModal" :character="selCharacter" >
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

        Are you sure you want to delete {{ selCharacter.name }}?
      </b-modal>

    </div>
  </div>

</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixin from '@/mixins/global-mixin';
import Character from '@/models/Character';
import CharacterForm from '@/components/CharacterForm.vue';
import { BvModalEvent } from 'bootstrap-vue';
import ViolationDndClass from '@/models/ViolationDndClass';
import { validate, ValidationError } from 'class-validator';
import ViolationCharacter from '@/models/ViolationCharacter';

@Component({
  components: { CharacterForm },
})
export default class CharacterView extends Mixins(GlobalMixin) {
  count = 0;

  dndCharacters: Character[] = [];

  selCharacter: Character = new Character();

  violation = new ViolationCharacter();

  // took validateCharacter to the characterForm
  async validateCharacter(char : Character): Promise<boolean> {
    // Reset violation to get rid of displayed errors for now
    this.violation = new ViolationCharacter();

    // validate data before sending fetch request
    const errors = await validate(char);
    console.log('This is from the validate method:');
    console.log(errors);
    if (errors.length > 0) {
      const temp = new ViolationCharacter();
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

  // this responds to a form button click instead of modal buttons
  async saveCharacterFromChild($event: any) {
    // this is the method that the characterForm emits to
    const tempCharacter:Character = $event;
    console.log('This is the event');
    console.log(tempCharacter);

    // need to do validation
    if (!await this.validateCharacter(tempCharacter)) {
      console.log('validation failed');
      return;
    }
    this.setBusy(true);
    // then just send it to the backend db
    console.log(this.CHARACTER_API);
    this.callAPI(this.CHARACTER_API, 'POST', tempCharacter) // returns a promise object
      .then((data) => {
        console.log(data);

        // determine if the class was added or updated
        this.$emit(tempCharacter === data.id ? 'updated' : 'added', data);
        this.refreshCards();
      })
      .catch((error) => {
        this.violation = error.data || {};
        // console.error(error.data[0]);
      })
      .finally(() => {
        this.setBusy(false);
        this.showCreateFormModal(false); // hide the modal manually because we prevented default to show error message
      });
  }

  deleteCharacter() {
    this.setBusy(true);
    console.log(this.selCharacter);

    this.callAPI(`${this.CHARACTER_API}/${this.selCharacter.id}`, 'delete')
      .then((res) => {
        this.selCharacter = new Character();
        // shouldn't need this in this case because the form isn't a child component
        // this.$emit('deleted', this.tempCharacter);
        this.refreshCards();
      })
      .catch((error) => {
        this.violation = error.data || {};
      })
      .finally(() => {
        this.setBusy(false);
      });
  }

  selectCard(item : Character) {
    // clear violations
    this.violation = new ViolationCharacter();
    // Reset violation to get rid of displayed errors for now
    if (this.selCharacter.id === item.id) {
      this.selCharacter = new Character();
    } else {
      this.selCharacter = Object.assign(new Character(), item);
    }
    console.log(this.selCharacter);
  }

  formatDate(dateString: Date) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  // getting the data from the backend database
  async refreshCards() {
    await this.fetchFromBackend();
  }

  mounted() {
    this.fetchFromBackend();
  }

  async fetchFromBackend() {
    try {
      const data = await this.provider(this.CHARACTER_API);
      this.dndCharacters = data.characters; // because api call returns count as well
      this.count = data.count;
      console.log(data);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  }
}
</script>
<style scoped>

</style>
