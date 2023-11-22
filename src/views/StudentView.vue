<!-- eslint-disable max-len -->
<!--
This component acts as the PARENT component for the StudentForm, StudentTable and StudentSearch Components
1. This component will set the prop for the child components and
2. handle the emits from the child components
3. handle sending information from one child component to another child component
4, if one child component is busy, this component will disable the other components as needed

VUE JS Directives
v-bind directive - https://vuejs.org/v2/api/#v-bind - 1 way communication from variables to control
v-on directive - https://vuejs.org/v2/api/#v-on - vue event handler hook to call a method

USING short cuts:
'v-bind:' can be shorted to just use the ':' -- example v-bind:disabled="isNew" can be shortened  :disabled="isNew"
-->
<template>
  <div class="text-left">
    <div class="row">
      <h1 class="col-lg-8">Students:</h1>
      <!-- SEARCH : when user selects student from search list then call the b-table selectRow function-->
      <AutoSearch class="col-lg-4 pl-lg-0 mb-2" min-search-length="3" @selected="handleSelect" @busy="setBusy" />
    </div>
    <div class="row">
      <!--      STUDENT FORM,
            bind the student prop to the data variable object 'selectedStudent',
            bind the disabled prop to the computed property 'isDisabled'
            set debug prop as needed
            handle all the emitted events from the StudentForm component
            -->
      <StudentForm class="col-md-6 col-lg-4 order-md-1 pl-lg-0 " debug
                   :student="selectedStudent" :disabled="isDisabled" @busy="setBusy"
                   @added="handleAdd" @updated="handleUpdate" @deleted="handleDelete"
                   @cancelled="handleCancel" @reset="handleReset" />
      <!--      STUDENT TABLE,
            bind the disabled prop to the computed property 'isDisabled'
            handle all the emitted events from the StudentTable component
            set debug prop as needed
            add a ref (reference) to this component as 'studentTable' so we can animate it when saveStudent is called
            https://vuejs.org/v2/api/#ref
            -->
      <!--    show the overlay if the component is busy or disabled-->
      <b-overlay :show="isDisabled" opacity=".25" class="col-md-6 col-lg-8 order-md-0">
        <b-table ref="studentTable" responsive
                 :items="provider" :fields="fields" :api-url="STUDENT_API" @row-clicked="selectedStudent=$event"
                 selectable select-mode="single" selected-variant="primary" striped hover primary-key="id"
                 no-provider-sorting no-provider-paging no-provider-filtering>
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>

        </b-table>
      </b-overlay>
    </div>
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
import { Component, Mixins } from 'vue-property-decorator';
import { BTable, BvTableCtxObject } from 'bootstrap-vue/src/components/table';
import GlobalMixin from '@/mixins/global-mixin';
import AutoSearch from '@/components/AutoSearch.vue';
import StudentForm from '@/components/StudentForm.vue';
import Student from '@/models/Student';

// this our TypeScript Component Class instead of the less friendly  JS class
@Component({
  components: { StudentForm, AutoSearch },
})
export default class StudentView extends Mixins(GlobalMixin) {
  $refs!: {
    studentTable: BTable
  }

  provider(ctx:BvTableCtxObject):Promise<any> {
    // return fetch('' + ctx.apiUrl).then(res => res.json())
    return this.callAPI(`${ctx.apiUrl}`);
  }

  // data variable
  selectedStudent:Student = new Student()

  // computed from b-table localItems
  get students() {
    return this.$refs.studentTable.localItems;
  }

  fields=[
    { key: 'id', sortable: true },
    { key: 'givenName', sortable: true },
    { key: 'familyName', sortable: true },
    { key: 'email', sortable: true },
    { key: 'phone', sortable: true },
    { key: 'address', sortable: true },
  ]

  // region METHODS

  selectRow(item:any) {
    if (!item.id) return;
    this.$refs.studentTable.selectRow(this.students.findIndex((i:any) => i.id === item.id));
  }

  refreshTable() {
    this.$refs.studentTable.refresh();
  }

  handleSelect(student:Student) {
    this.selectRow(student);
    this.selectedStudent = student;
  }

  handleAdd(student:Student) { // StudentForm emits a student when a new student returns from the api
    this.students.unshift(student);
    this.handleSelect(student);
  }

  handleUpdate(student:Student) { // StudentForm emits a student when an existing student is updated in the api
    Object.assign(this.selectedStudent, student); // update the values in the selectedStudent to the updated values
  }

  handleDelete(student:Student) { // StudentForm emits a student when an existing student is deleted in the api
    this.selectedStudent = new Student();
    // find the student in the student array
    const index = this.students.findIndex((s:any) => s.id === student.id);
    if (index >= 0) this.students.splice(index, 1);

    // this.refreshTable()
  }

  handleReset(student:Student) { // StudentForm emits a student when an existing student fails to delete in the api
    // issue happened with delete - so reload students
    this.refreshTable();
  }

  handleCancel() { // StudentForm emits that the cancel button was clicked
    // do nothing at this point
  }
}
</script>
