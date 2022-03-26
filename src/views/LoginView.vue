<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md3>
      <div style="text-align: center">
        <img :src="logo" width="80" />
      </div>
      <v-card>
        <v-form 
          ref="form"
          v-model="valid"
          lazy-validation>
          <v-card-title>Bem vindo(a) ao Fale Easy</v-card-title>
          <v-divider />
          <v-card-text>
            <v-text-field 
              type="email"
              label="E-mail"
              required
              v-model="email"
              :rules="emailRules" />
            <v-text-field 
              type="password" 
              label="Senha"
              required
              :counter="10"
              v-model="password"
              :rules="passwordRules" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn 
              color="primary" 
              block 
              tile 
              :disabled="!valid"
              @click="login">
              Login
              </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'login-view',
  metaInfo: {
    title: 'FaleEasy - Login'
  },

  data() {
    return {
      logo: require('../assets/logo.png'),
      
      // VALIDATION FORM
      valid: true,
      email: '',
      password: '',

      emailRules: [
        v => !!v || 'E-mail é obrigatório',
        v => /.+@.+/.test(v) || 'E-mail não é válido',
      ],

      passwordRules: [
        v => !!v || 'Senha é obrigatório',
        v => v.length <= 10 || 'Máximo 10 caracteres',
      ],
    }
  },

  methods: {
    login() {
      this.$refs.form.validate()

      const isLoading = this.$loading.show();

      this.api
      .login({
        email: this.email,
        password: this.password
      })
      .then(async res => {
        localStorage.setItem('user', res.data.user)
        localStorage.setItem('access_token', res.data.access_token)
        localStorage.setItem('expire_at', res.data.expire_at)
        window.location.href = 'dashboard'
      })
      .catch(() => {
        const Toast = this.$swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', this.$swal.stopTimer)
            toast.addEventListener('mouseleave', this.$swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'error',
          title: 'Dados inválidos'
        })
      })
      .finally(() => {
        isLoading.hide()
      })
    },
  }
}
</script>

<style>

</style>