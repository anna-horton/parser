<template>
  <Content>
    <h1>Каталог жестов
      <router-link class="logout" to="/logout">Выход</router-link>
    </h1>
    <div class="page-content">
      <div class="flex">
        <div class="categories">
          <Card :bordered="false">
            <h1 slot="title">
              Как общаться с глухими
            </h1>

          </Card>
        </div>
        <div>
          <Card :bordered="false">
            <h1 slot="title">
              Как общаться с глухими
            </h1>

          </Card>
        </div>
      </div>


    </div>
  </Content>
</template>

<script>
export default {
  name: "CategoriesPage",
}
</script>

<style scoped>
.flex {
  display: flex;
  width: 100%;
}
.categories {
  margin-right: 20px;
  width: 200px;
}
</style>