<template>
  <Content>
    <h1>
      Каталог жестов
      <router-link class="logout" to="/logout">Выход</router-link>
    </h1>
    <div class="page-content">
      <div class="flex">
        <div class="categories">
          <Card :bordered="false">
            <h3 slot="title">Каталог</h3>
            <Menu :active-name="selectedCategory._id">
              <template v-for="dactyl of categories">
                <MenuItem
                  @click="selectedCategory = dactyl"
                  :name="dactyl._id"
                  :key="dactyl._id"
                  :to="'/categories/' + dactyl._id"
                  class="list-dactyl"
                  >{{ dactyl.name }}</MenuItem
                >
              </template>
            </Menu>
          </Card>
        </div>
        <div>
          <Card v-if="selectedCategory._id" :bordered="false">
            <h3 slot="title">{{ selectedCategory.name }}</h3>
            <img class="image" :src="selectedCategory.image" />

            <div class="flex sp-btw">
              <Button @click="$router.go(-1)">Назад</Button>
              <Button @click="$router.go(1)">Вперед</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </Content>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
export default {
  name: "CategoriesPage",
  computed: {
    ...mapGetters(["categories"]),
    selectedCategory() {
      if (this.$route.params && this.$route.params.id && this.categories) {
        return this.categories.find(
          (d) => d._id.toString() === this.$route.params.id
        );
      }
      return {};
    },
  },
  actions: {
    ...mapActions(["getCategories"]),
  },
  mounted() {
    this.$store.dispatch("getCategories");
  },
  watch: {
    async selectedCategory() {
      const response = await axios.get(
        `/api/gestures?categories=${this.selectedCategory._id}`,
        {
          headers: {
            authorization: "Basic " + this.$store.getters.token,
          },
        }
      );
      console.log(response);
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  width: 100%;
}
.categories {
  margin-right: 20px;
  min-width: 200px;
  width: fit-content;
}
</style>
