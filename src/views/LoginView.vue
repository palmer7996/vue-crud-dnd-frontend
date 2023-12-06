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
              <b-button @click="logout" variant="danger">Log Out</b-button>
              <b-button @click="checkAccount">User Info</b-button>
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

  checkAccount() {
    alert(`Your username is: ${this.userData.username}
    \nYour access level is: ${this.userData.accessLevel}
    \nYour user id is: ${this.userData.id}`);
  }

  // reset the userData to the default
  logout() {
    this.saveUserData('read', '', 0, '');
  }

  login() {
    console.log(`Logging in with: ${this.userLogin.username} and ${this.userLogin.password}`);
    // this should make an api request to the backend server
    this.callAPI(this.USER_API, 'POST', this.userLogin) // returns a promise object
      .then((data) => {
        // assign to the userData global object
        this.saveUserData(data.accessLevel, data.token, data.id, data.username);
        alert(`Login successful!\nYour access level is: ${data.accessLevel}`);
      })
      .catch((error) => {
        alert(`${error.data.message}`);
        console.error('Error during login:', error.data);
      })
      .finally(() => {
        this.setBusy(false);
        console.log(this.userData);
      });
  }
}
</script>
