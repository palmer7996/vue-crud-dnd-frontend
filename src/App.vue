<template>
  <div id="app">
    <b-nav pills align="center" class="mb-4">
      <b-nav-item to="/" exact-active-class="active" >Home</b-nav-item> |
      <!--  Will probably hide the login route after done testing -->
      <b-nav-item to="/login" exact-active-class="active"> Login </b-nav-item> |

      <!--      <b-nav-item to="/student" exact-active-class="active"> Student </b-nav-item> |
      <b-nav-item to="/product" exact-active-class="active"> Product </b-nav-item> |-->

      <b-nav-item to="/character" exact-active-class="active"> Character </b-nav-item> |
      <b-nav-item to="/class" exact-active-class="active"> Classes </b-nav-item> |
      <b-nav-item to="/race" exact-active-class="active"> Races </b-nav-item> |
    </b-nav>
    <router-view class="container-xl"/>
  </div>
</template>
<script setup lang="ts">
</script>
