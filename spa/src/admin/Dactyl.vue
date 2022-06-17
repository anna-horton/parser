<template>
  <Content>
    <h1>
      Административная панель
      <router-link class="logout" to="/logout">Выход</router-link>
    </h1>
    <div class="page-content">
      <Card :bordered="false">
        <p slot="title">Дактиль</p>
        <Button slot="extra" @click="showModal = true">
          <Icon type="add-circle"></Icon>
          Добавить
        </Button>
        <Table
          stripe
          :columns="columns"
          :data="dactyls"
          no-data-text="Нет данных"
        ></Table>
        <Modal
          v-model="showModal"
          :title="isEdit ? 'Изменение символа' : 'Добавление нового символа'"
          :ok-text="isEdit ? 'сохранить' : 'добавить'"
          @on-ok="createOrUpdateDactyl"
          @on-cancel="isEdit = false"
          cancel-text="отмена"
        >
          <div class="modal-custom">
            <Form ref="gesturesRef" :model="dactylForm">
              <FormItem>
                <Upload
                  multiple
                  type="drag"
                  :format="['jpg', 'jpeg', 'png', 'mp4', 'gif']"
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
              <FormItem label="Ключ">
                <Input
                  v-model="dactylForm.key"
                  placeholder="Введите уникальное значение"
                ></Input>
              </FormItem>
              <FormItem label="Наименование">
                <Input
                  v-model="dactylForm.name"
                  placeholder="Название жеста"
                ></Input>
              </FormItem>
              <FormItem label="Язык">
                <Select placeholder="Выберите язык" v-model="dactylForm.lang">
                  <Option default value="RU">Русский</Option>
                </Select>
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
  name: "DactylPage",
  mounted() {
    this.getDactyls();
  },
  data() {
    return {
      showModal: false,
      isEdit: false,
      columns: [
        {
          title: "Жест",
          key: "file",
          width: "300",
          render: (h, params) => {
            return h("div", [
              h("img", {
                attrs: {
                  src: params.row.image,
                  class: "gusture-img",
                },
              }),
            ]);
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
          title: "Язык",
          key: "lang",
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
                      this.editDactyl(row);
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
                      this.removeDactyl(row._id);
                      this.$Notice.success({
                        title: "Успешно",
                        desc: "Категория удалена",
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
      dactylForm: {
        lang: "",
        key: "",
        name: "",
        image: null,
      },
    };
  },
  computed: {
    ...mapGetters(["dactyls"]),
  },
  methods: {
    ...mapActions([
      "getDactyls",
      "removeDactyl",
      "updateDactyl",
      "createDactyl",
    ]),
    handleSuccess(res, file) {
      file.url = `/assets/imgs/uploads/${res.object.filename}`;
      this.dactylForm.image = `/assets/imgs/uploads/${res.object.filename}`;
      file.name = res.object.originalname;
    },
    handleRemove() {
      this.dactylForm.image = null;
    },
    async createOrUpdateDactyl() {
      if (this.isEdit) {
        let resp = await this.updateDactyl(this.dactylForm);
        console.log(resp);

        this.$Notice.success({
          title: "Успешно",
          desc: "Символ обновлен",
        });
      } else {
        console.log(this.dactylForm);
        let resp = await this.createDactyl(this.dactylForm);
        console.log(resp);

        this.$Notice.success({
          title: "Успешно",
          desc: "Символ добавлен",
        });
      }
    },
    async editDactyl(object) {
      this.isEdit = true;
      this.dactylForm = {
        ...object,
      };
      this.showModal = true;
    },
  },
};
</script>

<style></style>
