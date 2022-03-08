<template>
  <h1>Logout</h1>
</template>

<script>

export default {
  name: 'LogoutPage',
  async created() {
    this.$store.dispatch('logout')
    this.$router.push('/login')
  }
}
</script>