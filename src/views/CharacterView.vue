<template>
  <div>
    <h1>Products</h1>
    <!--    <b-table :items="provider"></b-table>-->

    <div id="app" class="container mt-4">
      <div class="row">
        <b-card v-for="product in products" :key="product.id" class="col-md-4 mb-4">
          <!-- Customize the content inside the card based on your 'product' structure -->
          <b-card-title>{{ product.name }}</b-card-title>
          <b-card-sub-title>{{ product.size }}</b-card-sub-title>
          <b-card-text>ID: {{ product.id }}</b-card-text>
          <b-card-text>
            <span>Attribute 1: {{ product.attribute1 }}</span>
            <span class="ml-2">Attribute 2: {{ product.attribute2 }}</span>
            <span class="ml-2">Attribute 3: {{ product.attribute3 }}</span>
          </b-card-text>
          <b-card-text>
            <span>Attribute 4: asdf</span>
            <span class="ml-2">Attribute 5: asdf</span>
            <span class="ml-2">Attribute 6: asdf</span>
          </b-card-text>

          <!-- Edit and Delete buttons -->
          <b-button @click="editProduct(product)" variant="primary">Edit</b-button>
          <b-button @click="deleteProduct(product.id)" variant="danger">Delete</b-button>
        </b-card>
      </div>
    </div>

    <!--    <div id="app" class="container mt-4">-->
    <!--      <div class="row">-->
    <!--        <b-card v-for="item in provider" :key="item.id" class="col-md-4 mb-4">-->
    <!--          &lt;!&ndash; Customize the content inside the card based on your
    'item' structure &ndash;&gt;-->
    <!--          <template #header>-->
    <!--            <h4 class="mb-0">{{ item.name }}</h4>-->
    <!--          </template>-->

    <!--          <b-card-body>-->
    <!--            <b-card-text>{{ item.size }}</b-card-text>-->
    <!--          </b-card-body>-->

    <!--          &lt;!&ndash;          <b-list-group flush>&ndash;&gt;-->
    <!--          &lt;!&ndash;            <b-list-group-item v-for="(value, key) in item.attributes"
    :key="key">&ndash;&gt;-->
    <!--          &lt;!&ndash;              <strong>{{ key }}:</strong> {{ value }}&ndash;&gt;-->
    <!--          &lt;!&ndash;            </b-list-group-item>&ndash;&gt;-->
    <!--          &lt;!&ndash;          </b-list-group>&ndash;&gt;-->

    <!--          <b-card-footer>{{ item.price }}</b-card-footer>-->
    <!--        </b-card>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { BvTableCtxObject } from 'bootstrap-vue/src/components/table';

@Component
export default class Product extends Vue {
  products: any;

  // fetch from the proj3 server
  // Initialize products array
  data() {
    return {
      products: [],
    };
  }

  // ctx:BvTableCtxObject
  provider() {
    return fetch('http://localhost:3006/products')
      .then((res) => res.json())
      .then((data) => {
        this.products = data;
        return data;
      });
  }

  // Call provider on component mount
  mounted() {
    this.provider();
  }
}
</script>
