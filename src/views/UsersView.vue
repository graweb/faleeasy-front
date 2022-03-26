<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="users"
      item-key="id"
      show-select
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                elevation="2" 
                class="ml-4 mt-4 mr-2 mb-4" 
                outlined 
                color="deep-purple accent-4"  
                v-on="on"
                v-bind="attrs"
                @click="dialog = true">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Novo</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-if="selected.length == 1"
                elevation="2" 
                class="ml-0 mt-4 mr-2 mb-4" 
                outlined 
                color="deep-purple accent-4" 
                v-on="on"
                v-bind="attrs"
                @click="editDialog">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn v-else
                elevation="2" 
                class="ml-0 mt-4 mr-2 mb-4" 
                outlined 
                color="deep-purple accent-4"
                :disabled="true">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Editar</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-if="selected.length >= 1"
                elevation="2" 
                class="ml-0 mt-4 mr-2 mb-4" 
                outlined 
                color="deep-purple accent-4" 
                v-on="on"
                v-bind="attrs"
                @click="dialogRemove = true">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-btn v-else 
                elevation="2" 
                class="ml-0 mt-4 mr-2 mb-4" 
                outlined 
                color="deep-purple accent-4"
                :disabled="true">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Remover</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-if="selected.length >= 1" 
                elevation="2" 
                class="ml-0 mt-4 mr-2 mb-4" 
                outlined 
                color="deep-purple accent-4" 
                v-on="on"
                v-bind="attrs"
                @click="showDialogChangePassword(true)">
                <v-icon>mdi-lock</v-icon>
              </v-btn>
              <v-btn v-else
                elevation="2" 
                class="ml-0 mt-4 mr-2 mb-4" 
                outlined 
                color="deep-purple accent-4"
                :disabled="true">
                <v-icon>mdi-lock</v-icon>
              </v-btn>
            </template>
            <span>Mudar senha</span>
          </v-tooltip>
        </v-toolbar>

        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          />
        </v-card-title>
      </template>
      
    </v-data-table>

    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
      >
        <v-form 
          ref="form"
          v-model="valid"
          lazy-validation>

          <v-card>
            <v-card-title>
              <span class="text-h5">Informações usuário</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-input hidden v-model="editedItem.id" />

                  <v-col cols="12">
                    <v-text-field
                      label="Nome *"
                      required
                      v-model="editedItem.name"
                      :rules="nameRules"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-text-field
                      label="E-mail *"
                      required
                      type="email"
                      v-model="editedItem.email"
                      :rules="emailRules"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-select
                      v-model="editedItem.change_password"
                      :items="changePasswordItems"
                      :rules="[v => !!v || 'Mudar senha é obrigatório']"
                      label="Mudar senha *"
                      required
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-select
                      v-model="editedItem.type"
                      :items="typeItems"
                      :rules="[v => !!v || 'Tipo é obrigatório']"
                      label="Tipo *"
                      required
                    />
                  </v-col>

                </v-row>
              </v-container>
              <small style="color:red">* campos obrigatórios</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="red darken-1" 
                text 
                @click="dialogClose">
                Fechar
              </v-btn>
              <v-btn 
                color="primary" 
                :disabled="!valid"
                @click="save">
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>

      <v-dialog
        v-model="dialogRemove"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title class="text-h5">
            Atenção
          </v-card-title>
          <v-card-text>Deseja remover o(s) usuário(s) selecionado(s)?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              text
              @click="dialogRemove = false"
            >
              Não
            </v-btn>
            <v-btn
              color="primary"
              @click="saveDelete"
            >
              Sim
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialogChangePassword"
        persistent
        max-width="290"
      >
        <v-form 
          ref="formPass"
          v-model="validPassword"
          lazy-validation>
          <v-card>
            <v-card-title class="text-h5">
              Alterar senha
            </v-card-title>
            <v-card-text>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <v-text-field
                  label="Senha *"
                  required
                  :counter="10"
                  v-model="editPassword.password"
                  :rules="passwordRules"
                  type="password"
                />
              </v-col>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red darken-1"
                text
                @click="showDialogChangePassword(false)"
              >
                Não
              </v-btn>
              <v-btn
                color="primary"
                :disabled="!validPassword"
                @click="saveDialogChangePassword"
              >
                Sim
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>

    </v-row>
  </div>

</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      dialogRemove: false,
      dialogChangePassword: false,
      selected: [],
      users: [],
      search: '',
      headers: [
        { text: 'NOME', value: 'name' },
        { text: 'E-MAIL', value: 'email' },
        { text: 'MUDAR SENHA', value: 'change_password' },
        { text: 'TIPO', value: 'type' },
      ],

      // FORM VALIDATION
      valid: true,
      validPassword: true,

      changePasswordItems: [
        'Não',
        'Sim',
      ],

      typeItems: [
        'Administrador',
        'Professor',
        'Aluno',
      ],

      nameRules: [
        v => !!v || 'Nome é obrigatório',
      ],

      emailRules: [
        v => !!v || 'E-mail é obrigatório',
        v => /.+@.+/.test(v) || 'E-mail não é válido',
      ],

      passwordRules: [
        v => !!v || 'Senha é obrigatório',
        v => v.length <= 10 || 'Máximo 10 caracteres',
      ],

      editedIndex: -1,
      editedItem: {
        id: '',
        name: '',
        email: '',
        change_password: null,
        type: null,
      },

      editPassword: {
        password: '',
      },
    }
  },

  mounted() {
    this.listUsers()
  },

  watch: {
    options: {
      handler () {
        this.listUsers()
      },
      deep: true,
    },
  },

  methods: {

    listUsers() {

      const isLoading = this.$loading.show();

      this.api
      .listUsers()
      .then(async res => {
        this.users = res.data.data
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
          title: 'Erro de conexão, favor tente novamente'
        })

      })
      .finally(() => {
        isLoading.hide()
      })
    },

    dialogClose() {
      this.$refs.form.reset()
      this.dialog = false
    },

    save() {

      this.$refs.form.validate()

      const isLoading = this.$loading.show();

      const data = {
        'name': this.editedItem.name,
        'email': this.editedItem.email,
        'password': this.editedItem.password,
        'change_password': this.editedItem.change_password,
        'type': this.editedItem.type,
        'situation': this.editedItem.situation
      }

      if(this.editedItem.id == '') {
        
        this.api
        .storeUsers(data)
        .then(async () => {

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
            icon: 'success',
            title: 'Usuário cadastrado com sucesso'
          })

          this.listUsers()
          this.dialog = false

        })
        .catch(error => {

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
            title: error.response.data
          })

        })
        .finally(() => {
          isLoading.hide()
        })
      } else {

        this.api
        .updateUsers(this.editedItem.id, data)
        .then(async () => {

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
            icon: 'success',
            title: 'Usuário atualizado com sucesso'
          })

          this.listUsers()
          this.dialog = false

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
            title: 'Erro de conexão, favor tente novamente'
          })

        })
        .finally(() => {
          isLoading.hide()
        })

      }

      this.$refs.form.reset()
    },

    editDialog() {
      this.editedIndex = this.users.indexOf(this.selected)
      this.editedItem = Object.assign({}, this.selected[0])
      this.dialog = true
    },

    saveDelete() {

      for(var i = 0; i < this.selected.length; i++){

        const isLoading = this.$loading.show();

        if(this.selected[i].name === 'Admin' || this.selected[i].email === 'admin@admin.com') {
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
            icon: 'warning',
            title: 'O administrador não pode ser desativado'
          })

          isLoading.hide()
          this.dialogRemove = false

        } else {

          this.api
          .deleteUsers(this.selected[i].id)
          .then(async () => {

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
              icon: 'success',
              title: 'Usuário removido com sucesso'
            })

            this.listUsers()
            this.dialogRemove = false

          })
          .catch(error => {

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
              title: error.response.data
            })

          })
          .finally(() => {
            isLoading.hide()
          })
        }
      }
    },

    showDialogChangePassword(visible) {
      // this.$refs.formPass.reset()
      this.dialogChangePassword = visible;
    },

    saveDialogChangePassword() {

      const data = {
        'password': this.editPassword.password,
      }

      for(var i = 0; i < this.selected.length; i++){
        const isLoading = this.$loading.show();

        this.api
        .updateUsers(this.selected[i].id, data)
        .then(async () => {

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
            icon: 'success',
            title: 'Senha atualizada com sucesso'
          })

          this.listUsers()
          this.dialogChangePassword = false

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
            title: 'Erro de conexão, favor tente novamente'
          })

        })
        .finally(() => {
          isLoading.hide()
        })
      }
    }
  },
}
</script>

<style>

</style>