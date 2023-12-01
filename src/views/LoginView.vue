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
                  v-model="userLogin.username"
                  required
                  placeholder="Enter your username"
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Password:" label-for="password">
                <b-form-input
                  id="password"
                  v-model="userLogin.password"
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
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixin from '@/mixins/global-mixin';

@Component
export default class LoginView extends Mixins(GlobalMixin) {
  userLogin = {
    username: '',
    password: '',
  }

  login() {
    // console.log('Logging in with:');

    console.log('Logging in with:', this.userLogin);

    // this should make an api request to the backend server

    this.callAPI(this.USER_API, 'POST', this.userLogin) // returns a promise object
      .then((data) => {
        // assign to the userData global object
        this.userData.token = data.token;
        this.userData.accessLevel = data.accessLevel;
      })
      .catch((err) => {
        // get the violation messages from the api - if the web server responded
        // this.violation = err.data || {};
      })
      .finally(() => {
        this.setBusy(false);// tell parent that this component is no longer waiting for the api
        console.log(this.userData);
      });

    // then add to the userData global variable
  }
}
</script>
