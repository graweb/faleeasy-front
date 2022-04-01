<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="notifications"
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

      <template v-slot:[`item.situation`]="{ item }">
        <v-tooltip right v-if="item.situation == 0">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              :color="getColor(item.situation)"
              dark
              v-on="on"
              v-bind="attrs"
            >
              mdi-calendar-month
            </v-icon>
          </template>
          <span>Não lido</span>
        </v-tooltip>
        <v-tooltip right v-else>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              :color="getColor(item.situation)"
              dark
              v-on="on"
              v-bind="attrs"
            >
              mdi-check-bold
            </v-icon>
          </template>
          <span>Lido</span>
        </v-tooltip>
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
              <span class="text-h5">Informações notificação</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      label="Aluno *"
                      clearable
                      :items="students"
                      v-model="editedItem.user_id"
                      item-text="name"
                      item-value="id"
                      return-object
                      :disabled="editedItem.all_students"
                      :rules="editedItem.all_students ? [] : [v => !!v || 'Aluno é obrigatório']"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Assunto *"
                      required
                      v-model="editedItem.subject"
                      :rules="[v => !!v || 'Assunto é obrigatório']"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      v-model="editedItem.message"
                      label="Mensagem *"
                      :rules="[v => !!v || 'Mensagem é obrigatório']"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-switch
                      label="Enviar para todos os alunos?"
                      v-model="editedItem.all_students"
                    ></v-switch>
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
          <v-card-text>Deseja remover a(s) notificação(ões) selecionada(s)?</v-card-text>
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

    </v-row>
  </div>

</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      dialogRemove: false,
      selected: [],
      notifications: [],
      students: [],
      search: '',
      headers: [
        { text: 'ALUNO', value: 'user.name' },
        { text: 'ASSUNTO', value: 'subject' },
        { text: 'MENSAGEM', value: 'message' },
        { text: 'SITUAÇÃO', value: 'situation' },
      ],

      // FORM VALIDATION
      valid: true,

      editedItem: {
        user_id: '',
        subject: '',
        message: null,
        all_students: false,
        user: []
      },
    }
  },

  mounted() {
    this.listNotifications()
    this.listStudents()
  },

  watch: {
    options: {
      handler () {
        this.listNotifications()
      },
      deep: true,
    },
  },

  methods: {
    listNotifications() {
      const isLoading = this.$loading.show();

      this.api
      .listNotifications()
      .then(async res => {
        this.notifications = res.data.data
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

    listStudents() {
      const isLoading = this.$loading.show();

      this.api
      .listPeople('Aluno')
      .then(async res => {
        this.students = res.data.map(el => ({...el, text: `${el.name}`, value: `${el.id}`}))
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

    getColor (situation) {
      if (situation == 0) return 'orange darken-3'
      else return 'light-green darken-4'
    },

    dialogClose() {
      this.$refs.form.reset()
      this.dialog = false
    },

    save() {
      if(this.$refs.form.validate()) {
        const isLoading = this.$loading.show();

        let data = ''

        if(this.editedItem.all_students) {
          data = {
            'subject': this.editedItem.subject,
            'message': this.editedItem.message,
            'all_students': this.editedItem.all_students,
          }
        } else {
          data = {
            'user_id': this.editedItem.user_id.id,
            'subject': this.editedItem.subject,
            'message': this.editedItem.message,
            'all_students': this.editedItem.all_students,
          }
        }

        this.api
        .storeNotifications(data)
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
            title: 'Notificação cadastrada com sucesso'
          })

          this.listNotifications()
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

        this.$refs.form.reset()
      }
    },

    saveDelete() {
      for(var i = 0; i < this.selected.length; i++){
        const isLoading = this.$loading.show();

        this.api
        .deleteNotifications(this.selected[i].id)
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
            title: 'Notificação removida com sucesso'
          })

          this.listNotifications()
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
    },
  },
}
</script>

<style>

</style>