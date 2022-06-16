<template>
  <h1>Logout</h1>
</template>

<script>

export default {
  name: 'LogoutPage',
  created() {
    localStorage.removeItem('authInfo')
    this.$store.dispatch('logout')
    this.$router.push('/')
  }
}
</script>