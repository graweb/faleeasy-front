<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="reports"
      single-select
      item-key="name"
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
                <v-icon>mdi-printer</v-icon>
              </v-btn>
            </template>
            <span>Gerar relatório</span>
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
              <span class="text-h5">Relatório pacotes por aluno</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>

                  <v-col cols="12">
                    <v-autocomplete
                      label="Aluno *"
                      clearable
                      :items="students"
                      v-model="user_id"
                      :rules="[v => !!v || 'Aluno é obrigatório']"
                      item-text="name"
                      item-value="id"
                      return-object
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
                @click="dialog = false">
                Fechar
              </v-btn>
              <v-btn 
                color="primary" 
                :disabled="!valid"
                @click="generate">
                Gerar
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
      selected: [],
      search: '',
      headers: [
        { text: 'RELATÓRIO', value: 'name' }
      ],
      reports: [
        {
          name: 'Pacotes por aluno',
        },
        {
          name: 'Agenda do professor',
        },
        {
          name: 'Matéria aplicada por aluno',
        },
        {
          name: 'Bloqueio de aulas',
        },
      ],

      // FORM VALIDATION
      valid: true,

      user_id: '',
    }
  },

  mounted() {
    this.listStudents()
  },

  methods: {
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
  }
}
</script>

<style>

</style>