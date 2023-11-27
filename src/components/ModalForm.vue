<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class ModalForm extends Vue {

}
</script>

<template>
  <b-modal title="Delete Student" ok-variant="danger" cancel-variant="primary"
  >
    <!--    @ok="" v-model=""-->
    <!--    using slots -- https://vuejs.org/v2/guide/components-slots.html
      slot defined in b-modal -- https://bootstrap-vue.org/docs/components/modal#comp-ref-b-modal-slots
      modify the buttons that appear in the footer of the modal using pre-defined slots-->
    <template #modal-cancel>
      <!-- add a X icon to the cancel button-->
      <b-icon-x-square-fill /> Cancel
    </template>

    <template #modal-ok>
      <!-- change the OK button to say Delete instead and add a trash can icon-->
      <b-icon-trash-fill /> Submit
    </template>
    Are you sure you want to submit?
    <!--    should probably adjust this message maybe make it dynamic-->
  </b-modal>
</template>

<style scoped>

</style>
