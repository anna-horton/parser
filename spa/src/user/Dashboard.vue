<template>
  <Content >
    <h1>Проверьте камеру и микрофон <router-link class="logout" to="/logout">Выход</router-link></h1>
    <div class="page-content">
      <Row>
        <Col span="16">
          <Card :bordered="false"  class="camera-form" />
        </Col>
        <Col span="8">
          <Card :bordered="false" class="founded-field">
            <span>Я понял ваш жест как:  <a href="£">Солнце</a> </span>
            <img src="https://media.spreadthesign.com/image/500/alphabet-letter-866-1.jpg" alt="">
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span="16">
          <Card :bordered="false" class="input-field">
            <span>Введите жесты...</span>
            <Button>
              <Icon type="md-search" />
              Найти
            </Button>
            <Button>
              <svg width="13" height="18" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.3571 10.9693C7.80535 10.9693 8.9657 9.80023 8.9657 8.35198L8.97442 3.11733C8.97442 1.66907 7.80535 0.5 6.3571 0.5C4.90884 0.5 3.73977 1.66907 3.73977 3.11733V8.35198C3.73977 9.80023 4.90884 10.9693 6.3571 10.9693ZM10.981 8.35198C10.981 10.9693 8.76504 12.8014 6.3571 12.8014C3.94916 12.8014 1.73315 10.9693 1.73315 8.35198H0.25C0.25 11.327 2.62304 13.7873 5.48465 14.2148V17.0764H7.22954V14.2148C10.0911 13.796 12.4642 11.3357 12.4642 8.35198H10.981Z" fill="white"/>
              </svg>
            </Button>
          </Card>
        </Col>
        <Col span="8">
          <Card :bordered="false" class="props-field">
            <span>Я понял это как </span>
            <div class="your-world"><a href="£">Солнце</a> </div>
            <List>
              <ListItem>Категория: <b style="margin-left: 5px"> Общие жесты</b></ListItem>
              <ListItem>Часть речи: <b style="margin-left: 5px"> Существительное</b></ListItem>
              <ListItem>Другие варианты: <a style="margin-left: 5px"> Сон</a>, <a style="margin-left: 5px"> Домашний</a></ListItem>
            </List>
          </Card>
        </Col>
      </Row>
    </div>

  </Content>
</template>

<script>

export default {
  name: 'DashBoard',
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
