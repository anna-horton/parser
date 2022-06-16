<template>
  <Content class="empty-page">
    <div class="page-content">
      <Card :bordered="false" :style="{padding: '50px'}">
        <Form class="login-form" ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <FormItem>
            <h1>Войти</h1>
          </FormItem>
          <FormItem prop="email" label="Email">
            <Input type="email" v-model="formInline.email" placeholder="example@email.ru">
            </Input>
          </FormItem>
          <FormItem prop="password" label="Пароль">
            <Input type="password" v-model="formInline.password" placeholder="Password">
            </Input>
          </FormItem>
          <FormItem>
            <Button :disabled="isLoading" type="primary" @click="handleSubmit('formInline')">ВОЙТИ</Button>
          </FormItem>
          <FormItem>
            <span>Нет аккаунта? <a href="/reg">Создать аккаунт</a></span>
          </FormItem>
        </Form>
      </Card>
    </div>
  </Content>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LoginPage',
  data: () => {
    return {
      isLoading: false,
      formInline: {
        email: '',
        password: ''
      },
      ruleInline: {
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
  computed: {
    ...mapGetters(['isLogin'])
  },
  updated() {
    console.log(this.isLogin)
    if (this.isLogin) {
        this.$store.getters.user.isAdmin ? this.$router.push('/admin') : this.$router.push('/dashboard')
    }
  },
  methods: {
    async handleSubmit(name) {
      this.isLoading = true
      let valid = await this.$refs[name].validate()
      if (valid) {
        let response = await this.$store.dispatch('login', {
          ...this.formInline
        })
        this.isLoading = false

        if (response && response.code == 200) {
          this.$Notice.success({
            title: 'Успешно'
          })
          response.object.isAdmin ? this.$router.push('/admin') : this.$router.push('/dashboard')
        } else {
          this.$Notice.error({
            title: 'Ошибка',
            desc: response.message
          })
        }
      }
    }
  }
}
</script>