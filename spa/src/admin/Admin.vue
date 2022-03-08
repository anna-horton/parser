<template>
    <Content >
      <h1>Административная панель <router-link class="logout" to="/logout">Выход</router-link></h1>
      <div class="page-content">
        <Card :bordered="false">
          <p slot="title">
            Таблица жестов
          </p>
          <Button slot="extra" @click="showModal = true">
            <Icon type="add-circle"></Icon>
            Добавить
          </Button>
          <Table stripe :columns="columns" :data="data" no-data-text="Нет данных"></Table>
          <Modal
              v-model="showModal"
              title="Добавить новый жест"
              ok-text="добавить"
              @on-ok="createGusture"
              cancel-text="отмена"
              >
              <div class="modal-custom">
                <Form ref="gesturesRef" :model="gesturesForm" :rules="rules">
                  <FormItem>
                    <Upload
                        multiple
                        type="drag"
                        action="//jsonplaceholder.typicode.com/posts/">
                      <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>Выберите изображение или видео</p>
                      </div>
                    </Upload>
                  </FormItem>
                  <FormItem label="Часть речи">
                    <Select placeholder="Выберите часть речи" v-model="gesturesForm.entity">
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
                    <Select placeholder="Выберите категорию" v-model="gesturesForm.category">
                      <Option value="Union">Союз</Option>
                      <Option value="Pretext">Предлог</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="Ключ">
                    <Input v-model="gesturesForm.key" placeholder="Введите уникальное значение"></Input>
                  </FormItem>
                  <FormItem label="Активен">
                    <Checkbox v-model="gesturesForm.status" />
                  </FormItem>
                  <FormItem label="Наименование">
                    <Input v-model="gesturesForm.name" placeholder="Название жеста"></Input>
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
  name: 'AdminPage',
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
          title: 'Часть речи',
          key: 'entity'
        },
        {
          title: 'Категория',
          key: 'category'
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
          title: 'Статус',
          key: 'status',
          render: (h) => {
            return h('Icon', {
              props: {
                type: 'md-checkmark-circle-outline',
                size: '14'
              }
            });
          }
        },
        {
          title: 'Дата',
          key: 'date'
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
          entity: 'Существительное',
          category: 'Общие жесты',
          key: 'sun',
          name: 'Солнце',
          status: true,
          date: '28.02.2022',
          file: 'https://i.ytimg.com/vi/Epxevz2LkGA/maxresdefault.jpg'
        },
        {
          entity: 'Глагол',
          category: 'Общие жесты',
          key: 'gulat',
          name: 'Гулять',
          status: true,
          date: '28.02.2022',
          file: 'https://i.ytimg.com/vi/yVVnl5oCtJw/maxresdefault.jpg'
        },
        {
          entity: 'Существительное',
          category: 'Общие жесты',
          key: 'home',
          name: 'Дом',
          status: true,
          date: '28.02.2022',
          file: 'https://thumbs.dreamstime.com/b/%D0%B6%D0%B5%D1%81%D1%82-%D0%B4%D0%BE%D0%BC%D0%B0-%D0%BF%D0%BE%D0%BA%D0%B0%D0%B7%D0%B0-%D0%B6%D0%B5%D0%BD%D1%89%D0%B8%D0%BD%D1%8B-%D0%B2-%D1%8F%D0%B7%D1%8B%D0%BA%D0%B5-%D0%B6%D0%B5%D1%81%D1%82%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%B1%D0%B5%D0%BB%D0%B8%D0%B7%D0%BD%D0%B5-%D0%B1%D0%B5%D0%BB%D0%BE%D0%B9-%D0%BF%D1%80%D0%B5%D0%B4%D0%BF%D0%BE%D1%81%D1%8B%D0%BB%D0%BA%D0%B5-143462962.jpg'
        }
      ],
      isLoading: false,
      gesturesForm: {
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
      // let resp = await this.$store.dispatch('createGestures', this.gesturesForm)
      // console.log(resp)
      this.$Notice.success({
        title: 'Успешно',
        desc: 'Жест добавлен'
      })
    }

  }
}
</script>


<style>

</style>
