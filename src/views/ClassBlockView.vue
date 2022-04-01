<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="classBlock"
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
              <span class="text-h5">Informações bloqueio de aula</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
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
                      :disabled="editedItem.all_day"
                      :rules="startHourValidation"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-switch
                      label="O dia todo?"
                      v-model="editedItem.all_day"
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
          <v-card-text>Deseja cancelar o(s) bloqueio(s) de aula selecionado(s)?</v-card-text>
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
      menuDate: false,
      dialog: false,
      dialogRemove: false,
      selected: [],
      classBlock: [],
      teachers: [],
      search: '',
      headers: [
        { text: 'PROFESSOR', value: 'teacher' },
        { text: 'DIA', value: 'day' },
        { text: 'DE', value: 'start_hour' },
        { text: 'ATÉ', value: 'end_hour' },
      ],

      editedIndex: -1,
      editedItem: {
        teacher: '',
        day: '',
        start_hour: '',
        all_day: false,
      },

      // FORM VALIDATION
      valid: true,
    }
  },

  mounted() {
    this.listClassBlock()
    this.listTeachers()
  },

  watch: {
    options: {
      handler () {
        this.listClassBlock()
      },
      deep: true,
    },
  },

  methods: {
    listClassBlock() {
      const isLoading = this.$loading.show();

      this.api
      .listClassBlock()
      .then(async res => {
        this.classBlock = res.data
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

    dialogClose() {
      this.$refs.form.reset()
      this.dialog = false
    },

    startHourValidation() {
      if(this.editedItem.all_day) {
        this.editedItem.start_hour = ''
        return []
      } else {
        return [v => !!v || 'Horário é obrigatório']
      }
    },

    save() {
      if(this.$refs.form.validate()) {

        const isLoading = this.$loading.show();

        if(this.editedItem.all_day) {
          for(var i = 6; i <= 23; i++) {
            const data = {
              'teacher': this.editedItem.teacher,
              'day': this.editedItem.day,
              'start_hour': i,
            }

            this.api
            .storeClassBlock(data)
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
                title: 'Bloqueio de aula cadastrado com sucesso'
              })

              this.listClassBlock()
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
          }
        } else {
          const data = {
            'teacher': this.editedItem.teacher,
            'day': this.editedItem.day,
            'start_hour': this.editedItem.start_hour.replace(':00', '').replace(':00', ''),
          }

          this.api
          .storeClassBlock(data)
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
              title: 'Bloqueio de aula cadastrado com sucesso'
            })

            this.listClassBlock()
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
        }

        isLoading.hide()
      }
    },

    saveDelete() {
      for(var i = 0; i < this.selected.length; i++){
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
            title: 'Bloqueio de aula cancelado com sucesso'
          })

          this.listClassBlock()
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