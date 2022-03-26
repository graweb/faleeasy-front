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
                @click="showDialogChangePassword(true)">
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
        <v-icon
          :color="getColor(item.situation)"
          dark
          v-if="item.situation == 0"
        >
          mdi-calendar-month
        </v-icon>
        <v-icon
          :color="getColor(item.situation)"
          dark
          v-else
        >
          mdi-check-bold
        </v-icon>
      </template>

      <template v-slot:[`item.day`]="{ item }">
        <span>{{ item.day }}</span>
      </template>
      
      <template v-slot:[`item.start_hour`]="{ item }">
        <span>{{ item.start_hour }} hs</span>
      </template>

      <template v-slot:[`item.end_hour`]="{ item }">
        <span>{{ new Date(item.end_hour).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' }) }} hs</span>
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
                      label="Aluno"
                      clearable
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-autocomplete
                      label="Professor"
                      clearable
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-menu
                      ref="menu1"
                      v-model="menu1"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dateFormatted"
                          label="Date"
                          hint="MM/DD/YYYY format"
                          persistent-hint
                          prepend-icon="mdi-calendar"
                          v-bind="attrs"
                          @blur="date = parseDate(dateFormatted)"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date"
                        no-title
                        @input="menu1 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      label="Hora início"
                      type="time"
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

    </v-row>
  </div>

</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,


      selected: [],
      schedules: [],
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
        name: '',
        email: '',
        change_password: null,
        type: null,
      },
    }
  },

  mounted() {
    this.listSchedules()
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

    getColor (situation) {
      if (situation == 0) return 'orange darken-3'
      else if (situation == 1) return 'light-blue darken-4'
      else if (situation == 2) return 'green darken-4'
      else return 'deep-orange accent-4'
    },
  },
}
</script>

<style>

</style>