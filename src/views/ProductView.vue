<template>
  <div>
    <h1>Products</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <b-row>
        <b-col v-for="item in products" :key="item.id" lg="4" md="6" sm="12" class="mb-2">
          <b-card style="max-width: 20rem;">
            <b-card-body>
              <p class="card-text">Name: {{ item.name }}</p>
              <p class="card-text">Size: {{ item.size }}</p>
              <p class="card-text">Price: {{ item.price }}</p>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';
import GlobalMixin from '@/mixins/global-mixin';

@Component
export default class Product extends Mixins(GlobalMixin) {
  loading = true;

  products: any[] = [];

  mounted() {
    this.fetchProducts();
  }

  async fetchProducts() {
    try {
      this.products = await this.provider();
      this.loading = false;
    } catch (error) {
      console.error('Error fetching products:', error);
      this.loading = false;
    }
  }

  provider(): Promise<any> {
    return fetch('http://localhost:3006/products').then((res) => res.json());
  }
}
</script>
