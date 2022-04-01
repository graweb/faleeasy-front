<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="packages"
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
            <span>Cancelar</span>
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
                @click="dialogConfirm = true">
                <v-icon>mdi-check-bold</v-icon>
              </v-btn>
              <v-btn v-else
                elevation="2" 
                class="ml-0 mt-4 mr-2 mb-4" 
                outlined 
                color="deep-purple accent-4"
                :disabled="true">
                <v-icon>mdi-check-bold</v-icon>
              </v-btn>
            </template>
            <span>Confirmar</span>
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
          <span>Marcado</span>
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
          <span>Confirmado</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.hour_credit`]="{ item }">
        <span>{{ item.hour_credit }}:00 hs</span>
      </template>

      <template v-slot:[`item.hour_consumed`]="{ item }">
        <span>{{ item.hour_consumed }}:00 hs</span>
      </template>

      <template v-slot:[`item.expiration_date`]="{ item }">
        <span>{{ item.expiration_date | moment("DD/MM/YYYY") }}</span>
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
              <span class="text-h5">Informações do pacote</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-input hidden v-model="editedItem.id" />

                  <v-col cols="12">
                    <v-autocomplete
                      label="Aluno *"
                      clearable
                      :items="students"
                      v-model="editedItem.user_id"
                      :rules="[v => !!v || 'Aluno é obrigatório']"
                      item-text="name"
                      item-value="id"
                      return-object
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-autocomplete
                      label="Plano *"
                      clearable
                      :items="planoItems"
                      v-model="editedItem.plan"
                      :rules="[v => !!v || 'Plano é obrigatório']"
                      item-text="name"
                      item-value="value"
                    >
                    </v-autocomplete>
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
          <v-card-text>Deseja cancelar o(s) agendamento(s) selecionado(s)?</v-card-text>
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
        v-model="dialogConfirm"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title class="text-h5">
            Atenção
          </v-card-title>
          <v-card-text>Deseja confirmar o(s) pacote(s) selecionado(s)?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              text
              @click="dialogConfirm = false"
            >
              Não
            </v-btn>
            <v-btn
              color="primary"
              @click="saveConfirm"
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
import moment from 'moment'

export default {
  data () {
    return {
      menuDate: false,
      dialog: false,
      dialogRemove: false,
      dialogConfirm: false,
      selected: [],
      packages: [],
      students: [],
      search: '',
      headers: [
        { text: 'ALUNO', value: 'user.name' },
        { text: 'CRÉDITO HORAS', value: 'hour_credit' },
        { text: 'HORAS CONSUMIDAS', value: 'hour_consumed' },
        { text: 'VALIDATE', value: 'expiration_date' },
        { text: 'SITUAÇÃO', value: 'situation' },
      ],

      editedIndex: -1,
      editedItem: {
        id: '',
        user_id: '',
        plan: '',
      },

      // FORM VALIDATION
      valid: true,

      planoItems: [
        {name: '1 hora - Individual', value: '1'},
        {name: '4 horas - Individual 1x', value: '2'},
        {name: '8 horas - Individual 1x', value: '3'},
        {name: '8 horas - Individual 2x', value: '4'},
        {name: '12 horas - Individual 2x', value: '5'},
        {name: '4 horas - Grupo 2 pessoas 1x', value: '6'},
        {name: '4 horas - Grupo 3 pessoas 1x', value: '7'},
        {name: '8 horas - Grupo 2 pessoas 2x', value: '8'},
        {name: '8 horas - Grupo 3 pessoas 2x', value: '9'},
      ],
    }
  },

  computed: {
    formatDate () {
      return this.editedItem.day ? moment(this.editedItem.day).format('DD/MM/YYYY') : ''
    },
  },

  mounted() {
    this.listPackages()
    this.listStudents()
  },

  watch: {
    options: {
      handler () {
        this.listPackages()
      },
      deep: true,
    },
  },

  methods: {
    listPackages() {
      const isLoading = this.$loading.show();

      this.api
      .listPackages()
      .then(async res => {
        this.packages = res.data.data
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
      else if (situation == 1) return 'light-blue darken-4'
      else if (situation == 2) return 'green darken-4'
      else return 'deep-orange accent-4'
    },

    dialogClose() {
      this.$refs.form.reset()
      this.dialog = false
    },

    save() {
      this.$refs.form.validate()
      const isLoading = this.$loading.show();

      const data = {
        'user_id': this.editedItem.user_id.id,
        'plan': this.editedItem.plan,
      }

      this.api
      .storePackages(data)
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
          title: 'Pacote cadastrado com sucesso'
        })

        this.listPackages()
        this.dialog = false
        this.$refs.form.reset()

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

      this.editedItem.day = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
    },

    saveDelete() {
      for(var i = 0; i < this.selected.length; i++){
        const isLoading = this.$loading.show();

        this.api
        .deletePackages(this.selected[i].id)
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
            title: 'Pacote cancelado com sucesso'
          })

          this.listPackages()
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

    saveConfirm() {
      for(var i = 0; i < this.selected.length; i++){
        const isLoading = this.$loading.show();

        if(this.selected[i].situation == '1') {
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
            title: 'Esse pacote já está confirmado'
          })

          this.dialogConfirm = false
          isLoading.hide()

        } else {

          this.api
          .updatePackages(this.selected[i].id, {'situation': '1'})
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
              title: 'Pacote(s) confirmado(s) com sucesso'
            })

            this.listPackages()
            this.dialogConfirm = false

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
  },
}
</script>

<style>

</style>