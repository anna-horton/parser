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
  methods: {
    handleSubmit(name) {
      this.isLoading = true
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          let resp = await this.$http.post('/api/login', {
            ...this.formInline
          })

          if (resp && resp.status == 200 && resp.data.code == 200) {
            this.$Notice.success({
              title: 'Успешно'
            })
          } else {
            this.$Notice.error({
              title: 'Ошибка',
              desc: resp.message || resp.data.message
            })
          }
          console.log(resp)
          // this.$Message.success('Success!');
        } else {
          this.$Message.error('Fail!');
        }
      })
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    }
  }
}
</script>