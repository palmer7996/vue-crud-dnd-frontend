<template>
  <div>
    <h1>Products</h1>
    <b-table :items="provider"></b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { BvTableCtxObject } from 'bootstrap-vue/src/components/table';

@Component
export default class Product extends Vue {
  provider(ctx:BvTableCtxObject):Promise<any> {
    return fetch('http://localhost:3006/products').then((res) => res.json());
  }
}
</script>
