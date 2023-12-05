<!-- eslint-disable max-len -->
<!--
This component will act an html form to edit new or existing Character objects
The buttons at the bottom are connected to methods that will use axios to make AJAX calls to the Character API

VUE JS Directives
v-bind directive - https://vuejs.org/v2/api/#v-bind - 1 way communication from variables to control
v-on directive - https://vuejs.org/v2/api/#v-on - vue event handler hook to call a method
v-model directive - https://vuejs.org/v2/guide/forms.html - 2-way communication from form input to data variable ans vice versa

USING short cuts:
'v-bind:' can be shorted to just use the ':' -- example v-bind:disabled="isNew" can be shortened  :disabled="isNew"
'v-on:' can be shortened to just use @   -- example v-on:click="deleteCharacter" can be shortened  @click="deleteCharacter"

USING Bootstrap-vue components: https://bootstrap-vue.org/docs/components
b-form-group -- https://bootstrap-vue.org/docs/components/form-group
b-input-group -- https://bootstrap-vue.org/docs/components/input-group
b-input-group-prepend -- https://bootstrap-vue.org/docs/components/input-group#using-prepend-and-append-props
v-b-tooltip directive -- https://bootstrap-vue.org/docs/components/tooltip#v-b-tooltip-directive-usage
b-form-input -- https://bootstrap-vue.org/docs/components/form-input
b-button-group -- https://bootstrap-vue.org/docs/components/button-group
b-button -- https://bootstrap-vue.org/docs/components/button
b-icon animation -- https://bootstrap-vue.org/docs/icons#animated-icons
b-modal -- https://bootstrap-vue.org/docs/components/modal#using-v-model-property
-->

<!--    invalid-feedback prop is bound to the data variable object 'violation' and its name attribute
    hasErr prop is bound to the computed object 'hasErr' and it's ln attribute-->

<!--    form input, placeholder attribute bound to data variable object 'dt' and its ln attribute
             disabled prop is bound to computed property isDisabled
             value of form input is 2-way bound to the data variable object 'tempCharacter' and its name attribute
             trim directive removes white space at start or end of user entry
             when a key is pressed down the violation message for the field is cleared thus hiding the violation from the user  -->
<template>
  <div>
    <!-- NAME -->
    <b-form-group :invalid-feedback="violation.name" :state="hasErr.fN" class="mb-1">
      <b-input-group>
        <!--    tooltip hovers to the right of the prepend div-->
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.cN">
          <!--    add icon to left of input box and the title attribute is bound to the data variable object 'dt' and its ln attribute-->
          <b-icon-person-fill :title="dt.cN" />
        </b-input-group-prepend>

        <b-form-input :placeholder="dt.cN" :state="hasErr.fN" :disabled="isDisabled"
                      v-model="tempCharacter.name" trim @keydown="violation.name=null" />
      </b-input-group>
    </b-form-group>

    <!-- AGE -->
    <b-form-group :invalid-feedback="violation.age" :state="hasErr.aG" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.aG">
          <b-icon-calendar-event :title="dt.aG" />
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.aG" :state="hasErr.aG" :disabled="isDisabled"
                      v-model="tempCharacter.age" trim @keydown="violation.age=null" />
      </b-input-group>
    </b-form-group>

    <!-- GENDER -->
    <b-form-group :invalid-feedback="violation.gender" :state="hasErr.gN" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.gN">
          <b-icon-gender-ambiguous :title="dt.gN" />
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.gN" :state="hasErr.gN" :disabled="isDisabled"
                      v-model="tempCharacter.gender" trim @keydown="violation.gender=null" />
      </b-input-group>
    </b-form-group>

    <!-- DNDCLASS -->
    <b-form-group :invalid-feedback="violation.class" :state="hasErr.cL" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.cL">
          <b-icon-people :title="dt.cL" />
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.cL" :state="hasErr.cL" :disabled="isDisabled"
                      v-model="tempCharacter.class" trim @keydown="violation.class=null" />
      </b-input-group>
    </b-form-group>

    <!-- RACE-->
    <b-form-group :invalid-feedback="violation.race" :state="hasErr.rC" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.rC">
          <b-icon-people :title="dt.rC" />
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.rC" :state="hasErr.rC" :disabled="isDisabled"
                      v-model="tempCharacter.race" trim @keydown="violation.race=null" />
      </b-input-group>
    </b-form-group>

    <!-- ALIGNMENT -->
    <b-form-group :invalid-feedback="violation.alignment" :state="hasErr.aL" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.aL">
          <b-icon-circle-half :title="dt.aL" />
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.aL" :state="hasErr.aL" :disabled="isDisabled"
                      v-model="tempCharacter.alignment" trim @keydown="violation.alignment=null" />
      </b-input-group>
    </b-form-group>

    <!-- DESCRIPTION -->
    <b-form-group :invalid-feedback="violation.description" :state="hasErr.dC" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.dC">
          <b-icon-person-lines-fill :title="dt.dC" />
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.dC" :state="hasErr.dC" :disabled="isDisabled"
                      v-model="tempCharacter.description" trim @keydown="violation.description=null" />
      </b-input-group>
    </b-form-group>

    <!-- STRENGTH -->
    <b-form-group :invalid-feedback="violation.strength" :state="hasErr.sT" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.sT">
          <b-icon-dice1 :title="dt.sT" />
          <span class="ml-2">{{dt.sT}}:</span>
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.sT" :state="hasErr.sT" :disabled="isDisabled"
                      v-model="tempCharacter.strength" trim @keydown="violation.strength=null" />
      </b-input-group>
    </b-form-group>

    <!-- DEXTERITY -->
    <b-form-group :invalid-feedback="violation.dexterity" :state="hasErr.dX" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.dX">
          <b-icon-dice2 :title="dt.dX" />
          <span class="ml-2">{{dt.dX}}:</span>
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.dX" :state="hasErr.dX" :disabled="isDisabled"
                      v-model="tempCharacter.dexterity" trim @keydown="violation.dexterity=null" />
      </b-input-group>
    </b-form-group>

    <!-- CONSTITUTION -->
    <b-form-group :invalid-feedback="violation.constitution" :state="hasErr.cT" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.cT">
          <b-icon-dice3 :title="dt.cT" />
          <span class="ml-2">{{dt.cT}}:</span>
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.cT" :state="hasErr.cT" :disabled="isDisabled"
                      v-model="tempCharacter.constitution" trim @keydown="violation.constitution=null" />
      </b-input-group>
    </b-form-group>

    <!-- INTELLIGENCE -->
    <b-form-group :invalid-feedback="violation.intelligence" :state="hasErr.iT" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.iT">
          <b-icon-dice4 :title="dt.iT" />
          <span class="ml-2">{{dt.iT}}:</span>
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.iT" :state="hasErr.iT" :disabled="isDisabled"
                      v-model="tempCharacter.intelligence" trim @keydown="violation.intelligence=null" />
      </b-input-group>
    </b-form-group>

    <!-- WISDOM -->
    <b-form-group :invalid-feedback="violation.wisdom" :state="hasErr.wS" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.wS">
          <b-icon-dice5 :title="dt.wS" />
          <span class="ml-2">{{dt.wS}}:</span>
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.wS" :state="hasErr.wS" :disabled="isDisabled"
                      v-model="tempCharacter.wisdom" trim @keydown="violation.wisdom=null" />
      </b-input-group>
    </b-form-group>

    <!-- CHARISMA -->
    <b-form-group :invalid-feedback="violation.charisma" :state="hasErr.cA" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.cA">
          <b-icon-dice6 :title="dt.cA" />
          <span class="ml-2">{{dt.cA}}:</span>
        </b-input-group-prepend>
        <b-form-input id="chaInput" :placeholder="dt.cA" :state="hasErr.cA" :disabled="isDisabled"
                      v-model="tempCharacter.charisma" trim @keydown="violation.charisma=null" />

      </b-input-group>
    </b-form-group>

    <!--    currently replaced all the  @keydown="violation.intelligence=null" with =undefined and changed attributes in ViolationCharacter to ?-->
    <!-- ERROR MESSAGE -->
    <!--    only show this alert when there is an violationMessage attribute in the data variable object 'violation'    -->
    <!--    <b-alert variant="danger" :show="violation.violationMessage">-->
    <!--      {{violation.violationMessage}}-->
    <!--    </b-alert>-->
    <!--    ONLY SHOW debug info (very ugly) if the debug prop is set to true-->
    <b-alert variant="secondary" dismissible :show="debug">
      <pre>
PROPS:
{{$props}}

DATA:
{{$data}}
        </pre>
    </b-alert>
  </div>
</template>

<script lang="ts">
/* eslint-disable max-len */
import {
  Component, Mixins, Prop, Watch,
} from 'vue-property-decorator';
import Character from '@/models/Character';
import GlobalMixin from '@/mixins/global-mixin';
import ViolationCharacter from '@/models/ViolationCharacter';
import { ValidationError } from 'class-validator';

@Component
export default class CharacterForm extends Mixins(GlobalMixin) {
  @Prop({ type: Character, validator: (s) => s instanceof Character }) readonly character!: Character

  // this gives TypeError: cannot read properties of undefined (reading 'name')
  @Prop({ type: ViolationCharacter, validator: (s) => s instanceof ViolationCharacter }) readonly violation!: ViolationCharacter
  // violation = new ViolationCharacter()

  // region DATA VARIABLES
  // will store a copy of the values from the Character declared in the props section
  tempCharacter: Character = new Character()

  dt = {
    // Display Text - object that stores text to display to the user instead of the attribute names
    cN: 'Name',
    aG: 'Age',
    gN: 'Gender',

    cL: 'Class',
    rC: 'Race',
    aL: 'Alignment',

    dC: 'Description',

    sT: 'Strength',
    dX: 'Dexterity',
    cT: 'Constitution',
    iT: 'Intelligence',
    wS: 'Wisdom',
    cA: 'Charisma',
  }

  created() { // could also use mounted()
    this.tempCharacter = Object.assign(new Character(), this.character);
  }

  // region METHODS
  saveCharacter() {
    console.log('saveCharacter');
  }

  cancel() {
    console.log('cancel');
  }

  deleteCharacter() {
    console.log('deleteCharacter');
  }

  // endregion

  // region COMPUTED PROPERTIES
  get hasErr(): any {
    return { // bootstrap hasErrs used to display violation messages
      cN: this.violation.name ? false : null,
      aG: this.violation.age ? false : null,
      gN: this.violation.gender ? false : null,

      cL: this.violation.class ? false : null,
      rC: this.violation.race ? false : null,
      aL: this.violation.alignment ? false : null,

      dC: this.violation.description ? false : null,

      sT: this.violation.strength ? false : null,
      dX: this.violation.dexterity ? false : null,
      cT: this.violation.constitution ? false : null,
      iT: this.violation.intelligence ? false : null,
      wS: this.violation.wisdom ? false : null,
      cA: this.violation.charisma ? false : null,
    };
  }

  get isNew(): boolean {
    // if CharacterID is null, 0 , '' then it's a new Character not an existing Character
    return !this.character || !this.character.id;
  }

  // endregion

  // region WATCHES execute code when a data variable or prop is modified by processes in the application
  @Watch('character', { deep: true })// watch all attributes of the Character object - if any attribute changes then execute the handler
  onCharacterChanged(newCha: Character, oldStu: Character) { // execute this function when the Character object in the props section changes
    if (!newCha || !newCha.id) {
      // if new Character is null or doesn't have an id
      this.tempCharacter = new Character();// clear out temporary Character
    } else if (!oldStu || newCha.id !== oldStu.id) {
      // if old Character is null or new Character is not the same as old Character
      // COPY VALUES from the Character prop into new a temp Character object
      this.tempCharacter = Object.assign(new Character(), this.character);
    }
    // this.violation = new ViolationCharacter();// empty out violation messages - to hide them from the user
  }
}
</script>

<style scoped>

</style>
