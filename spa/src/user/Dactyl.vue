<template>
  <Content >
    <h1>Правила общения <router-link class="logout" to="/logout">Выход</router-link></h1>
    <div class="page-content">
      <Card :bordered="false">
        <p slot="title">
          Как общаться с глухими
        </p>

      </Card>
    </div>
  </Content>
</template>

<script>
export default {
  name: "RulesPage"
}
</script>

<style scoped>

</style>