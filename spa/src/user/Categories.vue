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
        <div class="g-card">
          <Card v-if="selectedG && selectedG._id" :bordered="false">
            <h3 slot="title">
              {{ selectedG.name }}
              <Button style="float: right" @click="selectedG = null"
                >Назад</Button
              >
            </h3>
            <img class="image" :src="selectedG.image" />
            <div
              class="flex"
              style="justify-content: space-between; margin-top: 20px"
            >
              <span
                >Часть речи: <b>{{ selectedG.entity }}</b></span
              >
              <span
                >Категория: <b>{{ selectedG.category.name }}</b></span
              >
              <span
                >Язык: <b>{{ selectedG.lang }}</b></span
              >
            </div>
          </Card>
          <Card v-else-if="selectedCategory._id" :bordered="false">
            <h3 slot="title">Категория - {{ selectedCategory.name }}</h3>

            <template v-for="g in gestures">
              <div class="g" @click="selectedG = g" :key="g._id">
                {{ g.name }}
              </div>
            </template>
            <div v-if="selectedG" class="a-g">
              <h3>{{ selectedG.name }}</h3>
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
  data() {
    return {
      selectedG: {},
    };
  },
  computed: {
    ...mapGetters(["categories", "gestures"]),
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
      if (response.data && response.data.array)
        this.$store.commit("setGestures", response.data.array);
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
  min-width: max-content;
  width: fit-content;
}
.image {
  width: 100%;
  border-radius: 10px;
}
.a-g {
  margin-top: 10px;
  width: 100%;
}
.g-card {
  width: 100%;
}
.g {
  padding: 3px;
  cursor: pointer;
}
.btns {
  display: flex;
  justify-content: space-between;
}
</style>
