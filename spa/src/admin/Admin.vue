<template>
  <Content>
    <h1>
      Административная панель
      <router-link class="logout" to="/logout">Выход</router-link>
    </h1>
    <div class="page-content">
      <Card :bordered="false">
        <p slot="title">Таблица жестов</p>
        <Button slot="extra" @click="showModal = true">
          <Icon type="add-circle"></Icon>
          Добавить
        </Button>
        <Table
          stripe
          :columns="columns"
          :data="gesturesFormated"
          no-data-text="Нет данных"
        ></Table>
        <Modal
          v-model="showModal"
          :title="isEdit ? 'Изменить жест' : 'Добавить новый жест'"
          :ok-text="isEdit ? 'сохранить' : 'добавить'"
          @on-ok="createGusture"
          @on-cancel="() => (isEdit = false)"
          cancel-text="отмена"
        >
          <div class="modal-custom">
            <Form
              ref="gesturesRef"
              :model="gesturesForm"
              @submit="(ev) => ev.defaultPrevent()"
            >
              <FormItem>
                <Upload
                  type="drag"
                  v-model="gesturesForm.image"
                  :format="['jpg', 'jpeg', 'png']"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  action="/api/upload"
                >
                  <div style="padding: 20px 0">
                    <Icon
                      type="ios-cloud-upload"
                      size="52"
                      style="color: #3399ff"
                    ></Icon>
                    <p>Выберите изображение или видео</p>
                  </div>
                </Upload>
              </FormItem>
              <FormItem label="Часть речи">
                <Select
                  placeholder="Выберите часть речи"
                  v-model="gesturesForm.entity"
                >
                  <Option value="Noun">Существительное</Option>
                  <Option value="Adjective">Прилогательное</Option>
                  <Option value="Verb">Глагол</Option>
                  <Option value="Participle">Причастие</Option>
                  <Option value="Numerals">Числительные</Option>
                  <Option value="Adverb">Наречие</Option>
                  <Option value="Pronoun">Местоимение</Option>
                  <Option value="Union">Союз</Option>
                  <Option value="Pretext">Предлог</Option>
                </Select>
              </FormItem>
              <FormItem label="Категория">
                <Select
                  placeholder="Выберите категорию"
                  v-model="gesturesForm.category"
                >
                </Select>
              </FormItem>
              <FormItem label="Ключ">
                <Input
                  v-model="gesturesForm.key"
                  placeholder="Введите уникальное значение"
                ></Input>
              </FormItem>
              <FormItem label="Активен">
                <Checkbox v-model="gesturesForm.status" />
              </FormItem>
              <FormItem label="Наименование">
                <Input
                  v-model="gesturesForm.name"
                  placeholder="Название жеста"
                ></Input>
              </FormItem>
            </Form>
          </div>
        </Modal>
      </Card>
    </div>
  </Content>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "AdminPage",
  mounted() {
    this.$store.dispatch("getGestures");
  },
  computed: {
    ...mapGetters(["gestures"]),
    gesturesFormated() {
      if (this.gestures) {
        return this.gestures.map((g) => {
          g.file = g.image;
          return g;
        });
      }
      return [];
    },
  },
  data() {
    return {
      showModal: false,
      columns: [
        {
          title: "Жест",
          key: "file",
          width: "300",
          render: (h, params) => {
            return h("div", [
              h("img", {
                attrs: {
                  src: params.row.file,
                  class: "gusture-img",
                },
              }),
            ]);
          },
        },
        {
          title: "Часть речи",
          key: "entity",
          render: (h, { row }) => {
            let txt = "";
            if (row.entity == "Noun") txt = "Существительное";
            if (row.entity == "Adjective") txt = "Прилогательное";
            if (row.entity == "Verb") txt = "Глагол";
            if (row.entity == "Participle") txt = "Причастие";
            if (row.entity == "Numerals") txt = "Числительные";
            if (row.entity == "Adverb") txt = "Наречие";
            if (row.entity == "Pronoun") txt = "Местоимение";
            if (row.entity == "Union") txt = "Союз";
            if (row.entity == "Pretext") txt = "Предлог";

            return h(
              "Span",
              {
                props: {
                  type: "md-checkmark-circle-outline",
                  size: "14",
                },
              },
              txt
            );
          },
        },
        {
          title: "Категория",
          key: "category",
          render: (h, { row }) => {
            return h(
              "Span",
              {
                props: {
                  type: "md-checkmark-circle-outline",
                  size: "14",
                },
              },
              row.category && row.category.name ? row.category.name : ""
            );
          },
        },
        {
          title: "Кодовое имя",
          key: "key",
        },
        {
          title: "Наименование",
          key: "name",
        },
        {
          title: "Статус",
          key: "status",
          render: (h) => {
            return h("Icon", {
              props: {
                type: "md-checkmark-circle-outline",
                size: "14",
              },
            });
          },
        },
        {
          title: "Дата",
          key: "date",
          render: (h, { row }) => {
            return h(
              "Span",
              {
                props: {
                  type: "md-checkmark-circle-outline",
                  size: "14",
                },
              },
              row.date ? new Date(row.date).toLocaleDateString("ru-RU") : ""
            );
          },
        },
        {
          title: "Действия",
          key: "actions",
          render: (h, { row }) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    icon: "md-create",
                  },
                  on: {
                    click: () => {
                      this.editGusture(row);
                    },
                  },
                },
                "Изменить"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    icon: "md-trash",
                  },
                  on: {
                    click: () => {
                      this.removeGusture(row._id);
                      this.$Notice.success({
                        title: "Успешно",
                        desc: "Жест удален",
                      });
                    },
                  },
                },
                "Удалить"
              ),
            ]);
          },
        },
      ],
      isLoading: false,
      isEdit: false,
      gesturesForm: {
        entity: "",
        category: "",
        key: "",
        name: "",
        status: true,
        image: null,
      },
    };
  },
  methods: {
    ...mapActions(["removeGusture", "updateGestures"]),
    handleRemove() {
      this.gesturesForm.image = null;
    },
    editGusture(object) {
      this.isEdit = true;
      this.showModal = true;
      this.gesturesForm = {
        ...object,
      };
    },

    handleSuccess(res, file) {
      file.url = `/assets/imgs/uploads/${res.object.filename}`;
      this.gesturesForm.image = `/assets/imgs/uploads/${res.object.filename}`;
      file.name = res.object.originalname;
    },
    async createGusture() {
      if (this.isEdit) {
        let resp = await this.$store.dispatch(
          "updateGestures",
          this.gesturesForm
        );
        console.log(resp);

        this.$Notice.success({
          title: "Успешно",
          desc: "Жест обновлен",
        });
      } else {
        let resp = await this.$store.dispatch(
          "createGestures",
          this.gesturesForm
        );
        console.log(resp);

        this.$Notice.success({
          title: "Успешно",
          desc: "Жест добавлен",
        });
      }
    },
  },
};
</script>


<style>
</style>
