<template>
  <Content>
    <h1>
      Административная панель
      <router-link class="logout" to="/logout">Выход</router-link>
    </h1>
    <div class="page-content">
      <Card :bordered="false">
        <p slot="title">Таблица категорий</p>
        <Button slot="extra" @click="showModal = true">
          <Icon type="add-circle"></Icon>
          Добавить
        </Button>
        <Table
          stripe
          :columns="columns"
          :data="categories"
          no-data-text="Нет данных"
        ></Table>
        <Modal
          v-model="showModal"
          :title="isEdit ? 'Изменить категорию' : 'Добавить категорию'"
          :ok-text="isEdit ? 'сохранить' : 'добавить'"
          @on-cancel="isEdit = false"
          @on-ok="updateOrCreateCategory"
          cancel-text="отмена"
        >
          <div class="modal-custom">
            <Form ref="gesturesRef" :model="categoriesForm">
              <FormItem label="Наименование">
                <Input
                  v-model="categoriesForm.name"
                  placeholder="Название жеста"
                ></Input>
              </FormItem>
              <FormItem label="Родительская категорию">
                <Select
                  placeholder="Выберите категорию"
                  v-model="categoriesForm.parent"
                >
                  <template v-for="category in categories">
                    <Option :key="category._id" :value="category._id">{{
                      category.name
                    }}</Option>
                  </template>
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
  name: "CategoriesAdminPage",
  mounted() {
    this.getCategories();
  },
  data() {
    return {
      showModal: false,
      isEdit: false,
      columns: [
        {
          title: "Наименование",
          key: "name",
        },
        {
          title: "Родительская категория",
          key: "parent",
          render: (h, { row }) => {
            return h(
              "Span",
              {
                props: {
                  type: "md-checkmark-circle-outline",
                  size: "14",
                },
              },
              row.parent && row.parent.name ? row.parent.name : ""
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
                      this.editCategory(row);
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
                      this.removeCategory(row._id);
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
      categoriesForm: {
        parent: "",
        name: "",
      },
    };
  },
  computed: {
    ...mapGetters(["categories"]),
  },
  methods: {
    ...mapActions([
      "getCategories",
      "removeCategory",
      "updateCategory",
      "createCategory",
    ]),
    async updateOrCreateCategory() {
      if (this.isEdit) {
        let resp = await this.updateCategory(this.categoriesForm);
        console.log(resp);

        this.$Notice.success({
          title: "Успешно",
          desc: "Категория обновлена",
        });
      } else {
        console.log(this.categoriesForm);
        let resp = await this.createCategory(this.categoriesForm);
        console.log(resp);

        this.$Notice.success({
          title: "Успешно",
          desc: "Категория добавлена",
        });
      }
    },
    async editCategory(object) {
      this.isEdit = true;
      this.categoriesForm = {
        ...object,
      };
      this.showModal = true;
    },
  },
};
</script>

<style></style>
