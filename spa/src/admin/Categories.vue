<template>
  <Content >
    <h1>Административная панель <router-link class="logout" to="/logout">Выход</router-link></h1>
    <div class="page-content">
      <Card :bordered="false">
        <p slot="title">
          Таблица категорий
        </p>
        <Button slot="extra" @click="showModal = true">
          <Icon type="add-circle"></Icon>
          Добавить
        </Button>
        <Table stripe :columns="columns" :data="data" no-data-text="Нет данных"></Table>
        <Modal
            v-model="showModal"
            title="Добавить категорию"
            ok-text="добавить"
            @on-ok="createGusture"
            cancel-text="отмена"
        >
          <div class="modal-custom">
            <Form ref="gesturesRef" :model="categoriesForm" :rules="rules">
              <FormItem label="Наименование">
                <Input v-model="categoriesForm.name" placeholder="Название жеста"></Input>
              </FormItem>
              <FormItem label="Родительская категорию">
                <Select placeholder="Выберите категорию" v-model="categoriesForm.category">
                  <Option value="Union">Союз</Option>
                  <Option value="Pretext">Предлог</Option>
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

export default {
  name: 'CategoriesAdminPage',
  mounted() {
    this.$store.dispatch('getGestures')
  },
  data() {
    return {
      showModal: false,
      columns: [
        {
          title: 'Наименование',
          key: 'name'
        },
        {
          title: 'Родительская категория',
          key: 'category'
        },
        {
          title: 'Действия',
          key: 'actions',
          render: (h) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'md-create'
                }
              }, 'Изменить'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'md-trash'
                }
              }, 'Удалить')
            ]);
          }
        },
      ],
      data: [
        {
          category: '',
          name: 'Общие жесты',
        },
        {
          category: 'Общие жесты',
          name: 'Числительные',
        },
      ],
      isLoading: false,
      categoriesForm: {
        entity: '',
        category: '',
        key: '',
        name: '',
        status: true,
        file: null
      },
      rules: {
        email: [
          {
            required: true,
            message: 'Пожалуйста, заполните почту', trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: 'Пожалуйста, введите пароль', trigger: 'blur' },
          { type: 'string', min: 6, message: 'Пароль не может быть меньше 6 символов', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async createGusture() {
      let resp = await this.$store.dispatch('createGestures', this.categoriesForm)
      console.log(resp)
    }

  }
}
</script>


<style>

</style>
