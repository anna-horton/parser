<template>
  <Content class="empty-page">
    <div class="page-content">
      <Card :bordered="false" :style="{ padding: '50px' }">
        <Form
          class="login-form"
          ref="formInline"
          :model="formInline"
          :rules="ruleInline"
          inline
        >
          <FormItem>
            <h1>Создать аккаунт</h1>
          </FormItem>
          <FormItem prop="name" label="Имя">
            <Input
              inva
              type="text"
              v-model="formInline.name"
              placeholder="Введите Ваше имя"
            >
            </Input>
          </FormItem>
          <FormItem prop="email" label="Email">
            <Input
              type="email"
              v-model="formInline.email"
              placeholder="Введите Ваш e-mail"
            >
            </Input>
          </FormItem>
          <FormItem prop="password" label="Пароль">
            <Input
              type="password"
              v-model="formInline.password"
              placeholder="Введите Ваш пароль"
            >
            </Input>
          </FormItem>
          <FormItem prop="rePassword" label="Пароль повторно">
            <Input
              type="password"
              v-model="formInline.rePassword"
              placeholder="Введите Ваш пароль ещё раз"
            >
            </Input>
          </FormItem>
          <FormItem>
            <Button
              :disabled="isLoading"
              type="primary"
              @click="handleSubmit('formInline')"
              >ЗАРЕГИСТРИРОВАТЬСЯ</Button
            >
          </FormItem>
          <FormItem>
            <span
              >Уже есть аккаунт?
              <router-link to="/login">Войти</router-link></span
            >
          </FormItem>
        </Form>
      </Card>
    </div>
  </Content>
</template>

<script>
import { required, email } from "vuelidate";

export default {
  name: "RegPage",
  data: () => {
    return {
      isLoading: false,
      formInline: {
        name: "",
        rePassword: "",
        email: "",
        password: "",
      },
      ruleInline: {
        name: [{ required: true }],
        rePassword: [{ required: true }],
        email: [
          {
            required: true,

            message: "Пожалуйста, заполните почту",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Пожалуйста, введите пароль",
            trigger: "blur",
          },
          {
            type: "string",
            min: 6,
            required: true,
            message: "Пароль не может быть меньше 6 символов",
            trigger: "blur",
          },
        ],
      },
    };
  },
  validations() {
    return {
      name: { required }, // Matches this.firstName
      email: { required, email }, // Matches this.lastName
      password: { required, minLength: 8 },
    };
  },
  created() {
    if (this.$store.getters.isLogin) this.$router.push("/admin");
  },
  methods: {
    async handleSubmit(name) {
      this.isLoading = true;
      let valid = await this.$refs[name].validate();
      if (valid && this.$v) {
        let response = await this.$store.dispatch("signup", {
          ...this.formInline,
        });
        this.isLoading = false;

        if (response && response.code == 200) {
          this.$Notice.success({
            title: "Успешно",
          });
          response.object.isAdmin
            ? this.$router.push("/admin")
            : this.$router.push("/dashboard");
        } else {
          this.$Notice.error({
            title: "Ошибка",
            desc: response.message,
          });
        }
      }
    },
  },
};
</script>
