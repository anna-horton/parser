<template>
  <Content class="empty-page">
    <div class="page-content">
      <Card :bordered="false" :style="{padding: '50px'}">
        <Form class="login-form" ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <FormItem>
            <h1>Создать аккаунт</h1>
          </FormItem>
          <FormItem prop="email" label="Имя">
            <Input type="email" v-model="formInline.email" placeholder="Введите Ваше имя">
            </Input>
          </FormItem>
          <FormItem prop="email" label="Email">
            <Input type="email" v-model="formInline.email" placeholder="Введите Ваш e-mail">
            </Input>
          </FormItem>
          <FormItem prop="password" label="Пароль">
            <Input type="password" v-model="formInline.password" placeholder="Введите Ваш пароль">
            </Input>
          </FormItem>
          <FormItem prop="password" label="Пароль повторно">
            <Input type="password" v-model="formInline.password" placeholder="Введите Ваш пароль ещё раз">
            </Input>
          </FormItem>
          <FormItem>
            <Button :disabled="isLoading" type="primary" @click="handleSubmit('formInline')">ВОЙТИ</Button>
          </FormItem>
          <FormItem>
            <span>Уже есть аккаунт? <a href="/reg">Войти</a></span>
          </FormItem>
        </Form>
      </Card>
    </div>
  </Content>
</template>

<script>

export default {
  name: 'RegPage',
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
  created() {
    if (this.$store.getters.isLogin) this.$router.push('/admin')
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
          this.$router.push('/admin')
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