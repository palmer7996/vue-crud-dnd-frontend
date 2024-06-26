<template>
  <div>
    <h1>Characters </h1>
    <h2>Total: {{count}}</h2>
    <div v-if="isBusy">Loading...</div>
    <div v-else class="mb-5">
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
          <!--          the view your characters will do the inverse if pressed again and show all characters-->
          <b-button v-b-toggle.sidebar-right :variant="btnTypeView" @click="refreshCards(!boolDisplayUsersCharacter)">
            {{ boolDisplayUsersCharacter ? 'View All Characters' : 'View Your Characters' }}</b-button>
          <b-button v-b-toggle.sidebar-right :variant="btnTypeSubmit" @click="showCreateFormModal(true)">
            {{ boolDisplayCreateOrEdit ? "Create" : "Edit" }}</b-button>
          <b-button v-b-toggle.sidebar-right :variant="btnTypeDelete" @click="showDeleteConfirmModal(true)">
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

      <b-modal title="Delete Character" :ok-variant="btnTypeDelete" :cancel-variant="btnTypeCancel"
               @ok="deleteCharacter" v-model="boolDeleteConfirmModal" :character="selCharacter" >
        <template #modal-cancel>
          <b-icon-x-octagon-fill /> Cancel
        </template>
        <template #modal-ok>
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
import { validate, ValidationError } from 'class-validator';
import ViolationCharacter from '@/models/ViolationCharacter';

@Component({
  components: { CharacterForm },
})
export default class CharacterView extends Mixins(GlobalMixin) {
  boolDisplayUsersCharacter = false;

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
    console.log('This is the event from the saveCharacterFromChild method');
    console.log(tempCharacter);

    // need to do validation
    if (!await this.validateCharacter(tempCharacter)) {
      console.log('validation failed');
      return;
    }
    // commented out because it would show loading during the displayErrorMsg function
    // this.setBusy(true);

    // then just send it to the backend db
    // if character id make a put, otherwise make a post
    const requestType: string = tempCharacter.id ? 'PUT' : 'POST';
    this.callAPI(this.CHARACTER_API, requestType, tempCharacter) // returns a promise object
      .then((data) => {
        const addOrUpdate = tempCharacter.id === data.id ? 'update' : 'add';
        if (addOrUpdate === 'update') {
          this.handleUpdate(this.dndCharacters, tempCharacter);
        } else {
          this.refreshCards(this.boolDisplayUsersCharacter);
        }
      })
      .catch((error) => {
        this.displayErrorMsg(error);
      })
      .finally(() => {
        // assign selCharacter to the modified character without this if they edit then reopen to edit the tempCharacter is given an older version
        this.selCharacter = new Character();
        this.toggleCreateOrEdit(true); // since it unselects after clicking on it
        // this.setBusy(false);
        this.showCreateFormModal(false); // hide the modal manually because we prevented default to show error message
      });
  }

  deleteCharacter() {
    console.log(this.selCharacter);
    // commented out because it would show loading during the displayErrorMsg function
    // this.setBusy(true);
    this.callAPI(`${this.CHARACTER_API}/${this.selCharacter.id}`, 'delete')
      .then((res) => {
        this.handleDelete(this.dndCharacters, this.selCharacter.id);
        this.selCharacter = new Character();
      })
      .catch((error) => {
        this.displayErrorMsg(error);
      })
      .finally(() => {
        // remove edit button and deselect
        this.toggleCreateOrEdit(true);
        this.count -= 1;
        // this.setBusy(false);
      });
  }

  selectCard(item : Character) {
    // toggle what displays under the create/edit button

    // clear violations
    this.violation = new ViolationCharacter();
    // Reset violation to get rid of displayed errors for now
    if (this.selCharacter.id === item.id) {
      this.clearSelection();
    } else {
      this.selCharacter = Object.assign(new Character(), item);
      this.toggleCreateOrEdit(false);
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

  // getting the data from the backend database, used for the view your/all characters button
  async refreshCards(userSpecific:boolean) {
    this.boolDisplayUsersCharacter = userSpecific;
    if (userSpecific) {
      await this.fetchFromBackend(`${this.CHARACTER_USER_API}/${this.userData.id}`);
      // also deselect the character because they might have selected a character that is going to disapear
      this.clearSelection();
    } else {
      await this.fetchFromBackend(this.CHARACTER_API_SORT_USERID);
    }
  }

  clearSelection() {
    this.selCharacter = new Character();
    this.toggleCreateOrEdit(true); // swap back to create because
  }

  mounted() {
    this.fetchFromBackend(this.CHARACTER_API_SORT_USERID);
  }

  async fetchFromBackend(characterApi:string) {
    try {
      const data = await this.provider(characterApi);
      this.dndCharacters = data.characters; // because api call returns count as well
      this.count = data.count;
      console.log('Returned data from db call:');
      console.log(data);
    } catch (error) {
      this.displayErrorMsg(error);
    }
  }
}
</script>
<style scoped>

</style>
