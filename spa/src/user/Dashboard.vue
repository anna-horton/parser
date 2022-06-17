<template>
  <Content>
    <h1>
      Поиск по жестам
      <router-link class="logout" to="/logout">Выход</router-link>
    </h1>
    <div class="page-content">
      <Row>
        <Col span="16">
          <Card :bordered="false" class="input-field">
            <Input v-model="inputG" placeholder="Введите жесты..." />
            <Button @click="search">
              <Icon type="md-search" />
              Найти
            </Button>
            <Button>
              <svg
                width="13"
                height="18"
                viewBox="0 0 13 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.3571 10.9693C7.80535 10.9693 8.9657 9.80023 8.9657 8.35198L8.97442 3.11733C8.97442 1.66907 7.80535 0.5 6.3571 0.5C4.90884 0.5 3.73977 1.66907 3.73977 3.11733V8.35198C3.73977 9.80023 4.90884 10.9693 6.3571 10.9693ZM10.981 8.35198C10.981 10.9693 8.76504 12.8014 6.3571 12.8014C3.94916 12.8014 1.73315 10.9693 1.73315 8.35198H0.25C0.25 11.327 2.62304 13.7873 5.48465 14.2148V17.0764H7.22954V14.2148C10.0911 13.796 12.4642 11.3357 12.4642 8.35198H10.981Z"
                  fill="white"
                />
              </svg>
            </Button>
          </Card>

          <Card v-if="selectedG" style="margin-top: 10px">
            <video class="image" controls="controls">
              <source :src="selectedG.image" />
            </video>
          </Card>
        </Col>
        <Col span="8" v-if="selectedG">
          <Card :bordered="false" class="props-field">
            <span>Найденный жест </span>
            <div class="your-world">
              <a href="#">{{ selectedG.name }}</a>
            </div>
            <List>
              <ListItem
                >Категория:
                <b style="margin-left: 5px">{{
                  selectedG.category.name
                }}</b></ListItem
              >
              <ListItem
                >Часть речи:
                <b style="margin-left: 5px">{{ selectedG.entity }}</b></ListItem
              >
              <ListItem
                >Язык:
                <b style="margin-left: 5px">{{ selectedG.lang }}</b></ListItem
              >
            </List>
          </Card>
        </Col>
      </Row>
    </div>
  </Content>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "DashBoard",
  mounted() {
    this.$store.dispatch("getGestures");
  },
  data() {
    return {
      showModal: false,
      selectedG: null,
      inputG: "",
      isLoading: false,
    };
  },
  methods: {
    ...mapActions(["getGestures"]),
    async search() {
      this.selectedG = null;
      let resp = await this.$store.dispatch("getGestures", {
        name: this.inputG,
      });

      if (resp && resp.length) {
        this.selectedG = resp[0];
      }
    },
  },
};
</script>

<style>
video {
  width: 100%;
}
</style>
