<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="schedules"
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

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-if="selected.length >= 1" 
                elevation="2" 
                class="ml-0 mt-4 mr-2 mb-4" 
                outlined 
                color="deep-purple accent-4" 
                v-on="on"
                v-bind="attrs"
                @click="dialogFinish = true">
                <v-icon>mdi-checkbox-marked</v-icon>
              </v-btn>
              <v-btn v-else
                elevation="2" 
                class="ml-0 mt-4 mr-2 mb-4" 
                outlined 
                color="deep-purple accent-4"
                :disabled="true">
                <v-icon>mdi-checkbox-marked</v-icon>
              </v-btn>
            </template>
            <span>Finalizar</span>
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

      <template v-slot:[`item.day`]="{ item }">
        <span>{{ item.day | moment("DD/MM/YYYY") }}</span>
      </template>
      
      <template v-slot:[`item.start_hour`]="{ item }">
        <span>{{ item.start_hour }}:00 hs</span>
      </template>

      <template v-slot:[`item.end_hour`]="{ item }">
        <span>{{ item.end_hour }}:00 hs</span>
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
              <span class="text-h5">Informações agendamento</span>
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
                      label="Professor *"
                      clearable
                      :items="teachers"
                      v-model="editedItem.teacher"
                      :rules="[v => !!v || 'Professor é obrigatório']"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      label="Dia *"
                      type="date"
                      v-model="editedItem.day"
                      :rules="[v => !!v || 'Dia é obrigatório']"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      label="Hora início *"
                      v-mask="'##:##'"
                      v-model="editedItem.start_hour"
                      :rules="[v => !!v || 'Horário é obrigatório']"
                    ></v-text-field>
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
          <v-card-text>Deseja confirmar o(s) agendamento(s) selecionado(s)?</v-card-text>
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

      <v-dialog
        v-model="dialogFinish"
        persistent
        max-width="600"
      >
        <v-form 
          ref="formFinish"
          v-model="validFinish"
          lazy-validation>

          <v-card>
            <v-card-title>
              <span class="text-h5">Finalizar agendamento</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  
                  <v-col cols="12">
                    <v-text-field
                      label="Matéria aplicada *"
                      required
                      v-model="editedFinishItem.subject"
                      :rules="[v => !!v || 'Matéria é obrigatório']"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-select
                      v-model="editedFinishItem.speak"
                      :items="appraisalItems"
                      :rules="[v => !!v || 'Fala é obrigatório']"
                      label="Fala *"
                      required
                      item-text="name"
                      item-value="value"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-select
                      v-model="editedFinishItem.listen"
                      :items="appraisalItems"
                      :rules="[v => !!v || 'Audição é obrigatório']"
                      label="Audição *"
                      required
                      item-text="name"
                      item-value="value"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-select
                      v-model="editedFinishItem.read"
                      :items="appraisalItems"
                      :rules="[v => !!v || 'Leitura é obrigatório']"
                      label="Leitura *"
                      required
                      item-text="name"
                      item-value="value"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-select
                      v-model="editedFinishItem.write"
                      :items="appraisalItems"
                      :rules="[v => !!v || 'Escrita é obrigatório']"
                      label="Escrita *"
                      required
                      item-text="name"
                      item-value="value"
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
                @click="dialogFinish = false">
                Fechar
              </v-btn>
              <v-btn 
                color="primary" 
                :disabled="!validFinish"
                @click="saveFinish">
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>

    </v-row>
  </div>

</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      dialog: false,
      dialogRemove: false,
      dialogConfirm: false,
      dialogFinish: false,
      selected: [],
      schedules: [],
      students: [],
      teachers: [],
      search: '',
      headers: [
        { text: 'ALUNO', value: 'user.name' },
        { text: 'PROFESSOR', value: 'teacher' },
        { text: 'DIA', value: 'day' },
        { text: 'DE', value: 'start_hour' },
        { text: 'ATÉ', value: 'end_hour' },
        { text: 'SITUAÇÃO', value: 'situation' },
      ],

      editedIndex: -1,
      editedItem: {
        id: '',
        user_id: '',
        teacher: '',
        day: '',
        start_hour: '',
        user: []
      },

      // FORM VALIDATION
      valid: true,
      validFinish: true,

      appraisalItems: [
        {name: 'Ótimo', value: 'O'},
        {name: 'Bom', value: 'B'},
        {name: 'Regular', value: 'R'},
        {name: 'Fraco', value: 'F'},
        {name: 'Não avaliado', value: 'N'},
      ],

      editedFinishItem: {
        subject: '',
        speak: '',
        listen: '',
        read: '',
        write: '',
      }
    }
  },

  computed: {
    formatDate () {
      return this.editedItem.day ? moment(this.editedItem.day).format('DD/MM/YYYY') : ''
    },
  },

  mounted() {
    this.listSchedules()
    this.listStudents()
    this.listTeachers()
  },

  watch: {
    options: {
      handler () {
        this.listSchedules()
      },
      deep: true,
    },
  },

  methods: {
    listSchedules() {
      const isLoading = this.$loading.show();

      this.api
      .listSchedules()
      .then(async res => {
        this.schedules = res.data.data
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

    listTeachers() {
      const isLoading = this.$loading.show();

      this.api
      .listPeople('Professor')
      .then(async res => {
        this.teachers = res.data.map(el => el.name)
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
      if(this.$refs.form.validate()) {

        const isLoading = this.$loading.show();

        const data = {
          'user_id': this.editedItem.user_id.id ?? this.editedItem.user.id,
          'teacher': this.editedItem.teacher,
          'day': this.editedItem.day,
          'start_hour': this.editedItem.start_hour.replace(':00', '').replace(':00', ''),
        }

        if(this.editedItem.id === '' || this.editedItem.id === null) {

          this.api
          .storeSchedules(data)
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
              title: 'Agendamento cadastrado com sucesso'
            })

            this.listSchedules()
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
        } else {
          this.api
          .updateSchedules(this.editedItem.id, data)
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
              title: 'Agendamento atualizado com sucesso'
            })

            this.listSchedules()
            this.dialog = false
            this.$refs.form.reset()

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

        this.selected = [];
      }
    },

    editDialog() {
      this.editedIndex = this.schedules.indexOf(this.selected)
      this.editedItem = Object.assign({}, this.selected[0])
      this.editedItem.start_hour = this.selected[0].start_hour + ':00'
      this.dialog = true
    },

    saveDelete() {
      for(var i = 0; i < this.selected.length; i++) {

        const isLoading = this.$loading.show();

        this.api
        .deleteSchedules(this.selected[i].id)
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
            title: 'Agendamento cancelado com sucesso'
          })

          this.listSchedules()
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
          this.selected = [];
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
            title: 'Esse agendamento já está confirmado'
          })

          this.dialogConfirm = false
          isLoading.hide()

        } else {

          this.api
          .updateSchedules(this.selected[i].id, {'situation': '1'})
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
              title: 'Agendamento(s) confirmado(s) com sucesso'
            })

            this.listSchedules()
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
            this.selected = [];
            isLoading.hide()
          })
        }
      }
    },

    saveFinish() {
      if(this.$refs.formFinish.validate()) {
      
        for(var i = 0; i < this.selected.length; i++){

          const isLoading = this.$loading.show();

          const data = {
            'subject': this.editedFinishItem.subject,
            'speak': this.editedFinishItem.speak,
            'listen': this.editedFinishItem.listen,
            'read': this.editedFinishItem.read,
            'write': this.editedFinishItem.write,
          }

          this.api
          .updateSchedules(this.selected[i].id, data)
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
              title: 'Agendamento(s) finalizado(s) com sucesso'
            })

            this.listSchedules()
            this.dialogFinish = false
            this.$refs.formFinish.reset()

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