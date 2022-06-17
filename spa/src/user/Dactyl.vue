<template>
  <Content>
    <h1>
      Дактиль (Азбука)
      <router-link class="logout" to="/logout">Выход</router-link>
    </h1>

    <div class="flex">
      <div class="categories">
        <Card :bordered="false">
          <h3 slot="title">Буквы</h3>
          <Menu :active-name="selectedDactyl._id">
            <template v-for="dactyl of dactyls">
              <MenuItem
                @click="selectedDactyl = dactyl"
                :name="dactyl._id"
                :key="dactyl._id"
                :to="'/dactyl/' + dactyl._id"
                class="list-dactyl"
                >{{ dactyl.name }}</MenuItem
              >
            </template>
          </Menu>
        </Card>
      </div>
      <div>
        <Card v-if="selectedDactyl._id" :bordered="false">
          <h3 slot="title">{{ selectedDactyl.name }}</h3>
          <img class="image" :src="selectedDactyl.image" />

          <div class="flex sp-btw">
            <Button @click="$router.go(-1)">Назад</Button>
            <Button @click="$router.go(1)">Вперед</Button>
          </div>
        </Card>
      </div>
    </div>
  </Content>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "DactylPage",
  data() {
    return {};
  },

  computed: {
    ...mapGetters(["dactyls"]),
    selectedDactyl() {
      if (this.$route.params && this.$route.params.id && this.dactyls) {
        return this.dactyls.find(
          (d) => d._id.toString() === this.$route.params.id
        );
      }
      return {};
    },
  },
  actions: {
    ...mapActions(["getDactyls"]),
  },
  mounted() {
    this.$store.dispatch("getDactyls");
  },
};
</script>

<style scoped>
.flex {
  display: flex;
}
.flex > div:first-of-type {
  margin-right: 20px;
}

.dactyl {
  cursor: pointer;
}
.ivu-list-split .ivu-list-header {
  font-weight: bold;
}
.sp-btw {
  justify-content: space-between;
}
.image {
  max-width: 100%;
  border-radius: 10px;
}
</style>
