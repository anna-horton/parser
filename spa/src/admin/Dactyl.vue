<template>
  <Content >
    <h1>Административная панель <router-link class="logout" to="/logout">Выход</router-link></h1>
    <div class="page-content">
      <Card :bordered="false">
        <p slot="title">
          Дактиль
        </p>
        <Button slot="extra" @click="showModal = true">
          <Icon type="add-circle"></Icon>
          Добавить
        </Button>
        <Table stripe :columns="columns" :data="data" no-data-text="Нет данных"></Table>
        <Modal
            v-model="showModal"
            title="Добавление нового символа"
            ok-text="добавить"
            @on-ok="createGusture"
            cancel-text="отмена"
        >
          <div class="modal-custom">
            <Form ref="gesturesRef" :model="dactylForm" :rules="rules">
              <FormItem>
                <Upload
                    multiple
                    type="drag"
                    paste="true"
                    action="/api/image">
                  <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>Выберите изображение или видео</p>
                  </div>
                </Upload>
              </FormItem>
              <FormItem label="Ключ">
                <Input v-model="dactylForm.key" placeholder="Введите уникальное значение"></Input>
              </FormItem>
              <FormItem label="Наименование">
                <Input v-model="dactylForm.name" placeholder="Название жеста"></Input>
              </FormItem>
              <FormItem label="Язык">
                <Select placeholder="Выберите язык" v-model="dactylForm.lang">
                  <Option value="Noun">Русский</Option>
                  <Option value="Adjective">Английский</Option>
                  <Option value="Verb">Франзуский</Option>
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
  name: 'DactylPage',
  mounted() {
    this.$store.dispatch('getGestures')
  },
  data() {
    return {
      showModal: false,
      columns: [
        {
          title: 'Жест',
          key: 'file',
          width: '300',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.file,
                  class: 'gusture-img'
                }
              })
            ]);
          }
        },
        {
          title: 'Кодовое имя',
          key: 'key'
        },
        {
          title: 'Наименование',
          key: 'name'
        },
        {
          title: 'Язык',
          key: 'lang'
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
          key: 'd',
          name: 'Д',
          lang: 'Русский',
          file: 'https://media.spreadthesign.com/image/500/alphabet-letter-870-1.jpg'
        }, {
          key: 'a',
          name: 'A',
          lang: 'Английский',
          file: 'https://media.spreadthesign.com/image/500/alphabet-letter-866-1.jpg'
        }
      ],
      isLoading: false,
      dactylForm: {
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
      let resp = await this.$store.dispatch('createGestures', this.dactylForm)
      console.log(resp)
    }

  }
}
</script>


<style>

</style>
