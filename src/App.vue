<template>
  <v-app>

    <v-navigation-drawer 
      app 
      v-if="this.$router.history.current.fullPath != '/'" 
      clipped
      mini-variant
      permanent
      class="deep-purple accent-4"
      dark >

      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img :src="logo"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>John Leider</v-list-item-title>

        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="item.action"
        >

          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              
              <v-list-item-content v-bind="attrs" v-on="on">
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
              </v-list-item-content>

            </template>
            <span>{{ item.tooltip }}</span>
          </v-tooltip>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list dense>
          <v-list-item link @click="logout">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                
                <v-list-item-content v-bind="attrs" v-on="on">
                  <v-list-item-icon>
                    <v-icon>mdi-logout</v-icon>
                  </v-list-item-icon>
                </v-list-item-content>
              </template>
              <span>Sair do sistema</span>
            </v-tooltip>
          </v-list-item>
        </v-list>
      </template>
      
    </v-navigation-drawer>

    <v-main>
      <v-container fluid :class="this.$router.history.current.fullPath != '/' ? '' : 'fill-height'">
        <router-view></router-view>
      </v-container>
    </v-main>
    
  </v-app>
</template>

<script>

export default {
  name: 'App',
  metaInfo: {
    title: 'FaleEasy'
  },

  data () {
    return {
      logo: require('./assets/logo.png'),
      items: [
        { title: 'Home', icon: 'mdi-home', tooltip: 'Home', action: () => { this.$router.push('/dashboard').catch(() => {}) }},
        { title: 'Pacotes', icon: 'mdi-package', tooltip: 'Pacotes', action: () => { this.$router.push('/packages').catch(() => {}) }},
        { title: 'Agenda', icon: 'mdi-calendar-check', tooltip: 'Agenda', action: () => { this.$router.push('/schedule').catch(() => {}) }},
        { title: 'Bloqueio de aulas', icon: 'mdi-block-helper', tooltip: 'Bloqueio de aulas', action: () => { this.$router.push('/class-block').catch(() => {}) }},
        { title: 'Usuários', icon: 'mdi-account-multiple', tooltip: 'Usuários', action: () => { this.$router.push('/users').catch(() => {}) }},
        { title: 'Exercícios', icon: 'mdi-book-open-variant', tooltip: 'Exercícios', action: () => { this.$router.push('/exercises').catch(() => {}) }},
        { title: 'Notificações', icon: 'mdi-bell', tooltip: 'Notificações', action: () => { this.$router.push('/notifications').catch(() => {}) }},
        { title: 'Relatórios', icon: 'mdi-file-chart-outline', tooltip: 'Relatórios', action: () => { this.$router.push('/reports').catch(() => {}) }},
      ],
    }
  },

  methods: {
    logout() {

      this.$swal.fire({
        title: 'Deseja sair do sistema?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.logout({email: localStorage.getItem('user')})
          this.$router.push('/')
        }
      })
    }
  }
};
</script>

<style>
.v-toolbar__content, .v-toolbar__extension {
  padding: 0 !important;
}

.swal2-title {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}

</style>
