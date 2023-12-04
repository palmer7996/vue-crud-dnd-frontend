<template>
  <div>
    <h1>Classes</h1>
    <div v-if="isBusy">Loading...</div>
    <div v-else>
      <b-row>
        <b-col v-for="item in dndCharacters" :key="item.id" lg="6" md="6" sm="12" class="mb-2">
          <b-card @click="selectCard(item)" :class="{'border-primary': selCharacter.id === item.id}">
            <b-card-body >
              <h4 class="mb-4 font-weight-bold">{{ item.name }}</h4>

              <!-- Details in columns -->
              <b-row>
                <b-col md="6">
                  <!--                  <p class="card-text">Item Info: {{ item }}</p>-->
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
          <b-button v-b-toggle.sidebar-right variant="primary" @click="showCreateFormModal">
            Create/Edit</b-button>
          <b-button v-b-toggle.sidebar-right variant="danger" @click="showDeleteConfirmModal">
            Delete</b-button>
        </b-button-group>

      </div>

      <!--      MODAL FORM-->
      <b-modal title="Create" ok-variant="ok" cancel-variant="primary"
               @ok="createCharacter" v-model="boolCreateFormModal">
        <CharacterForm debug
                       :character="selCharacter" :disabled="isDisabled" @busy="setBusy"
        />
        <!--        shouldn't need to pass any of these because the add, and delete are handled in the view-->
        <!--        class="col-md- col-lg-4 order-md-1 pl-lg-0 "-->
        <!--        @added="handleAdd" @updated="handleUpdate" @deleted="handleDelete"-->
        <!--        @cancelled="handleCancel" @reset="handleReset"-->

        <template #modal-cancel>
          <b-icon-stop /> Cancel
        </template>
        <template #modal-ok>
          <b-icon-person-plus-fill />
          {{ selCharacter.id ? 'Edit' : 'Create' }}
        </template>
      </b-modal>

      <b-modal title="Delete Character" ok-variant="danger" cancel-variant="primary"
               @ok="deleteCharacter" v-model="boolDeleteConfirmModal">
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

@Component({
  components: { CharacterForm },
})
export default class Product extends Mixins(GlobalMixin) {
  dndCharacters: Character[] = [];

  selCharacter: Character = new Character();

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

  createCharacter() {
    console.log('create');
  }

  deleteCharacter() {
    console.log('delete');
  }

  selectCard(item : Character) {
    if (this.selCharacter.id === item.id) {
      this.selCharacter = new Character();
    } else {
      this.selCharacter = Object.assign(new Character(), item);
    }
    console.log(this.selCharacter);
  }

  async refreshCards() {
    await this.fetchFromBackend();
  }

  // getting the data from the backend database
  mounted() {
    this.fetchFromBackend();
  }

  async fetchFromBackend() {
    try {
      const data = await this.provider(this.CHARACTER_API);
      this.dndCharacters = data.characters;
      console.log(this.dndCharacters);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }
}
</script>
<style scoped>

</style>
