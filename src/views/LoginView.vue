<template>
  <div class="login">
    <b-container>
      <b-row align-h="center" class="mt-5">
        <b-col sm="8" md="6" lg="4">
          <b-card title="Login">
            <b-form @submit.prevent="login">
              <b-form-group label="Username:" label-for="username">
                <b-form-input
                  id="username"
                  v-model="username"
                  required
                  placeholder="Enter your username"
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Password:" label-for="password">
                <b-form-input
                  id="password"
                  v-model="password"
                  required
                  type="password"
                  placeholder="Enter your password"
                ></b-form-input>
              </b-form-group>

              <b-button type="submit" variant="primary">Login</b-button>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { Mixins } from 'vue-property-decorator';
import GlobalMixin from '@/mixins/global-mixin';

export default class LoginView extends Mixins(GlobalMixin) {
  data() {
    return {
      username: '',
      password: '',
    };
  }

  login() {
    // console.log('Logging in with:');

    console.log('Logging in with:', this.username, this.password);

    // this should make a fetch request to the backend server

    // then add to the userData global variable
  }
}
</script>
