<template>
  <v-app id="inspire">
    <div>
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Registracija</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <form name="tab-tracker-form" autocomplete="off">
                    <v-text-field label="Email" v-model="email"></v-text-field>
                    <br />
                    <v-text-field
                      label="Lozinka"
                      type="password"
                      v-model="password"
                      autocomplete="new-password"
                    ></v-text-field>
                    <br />
                    <v-text-field
                      label="Ime"
                      type="text"
                      v-model="name"
                    ></v-text-field>
                    <br />
                    <v-text-field
                      label="Prezime"
                      type="text"
                      v-model="surname"
                    ></v-text-field>
                    <v-text-field
                      label="Spol"
                      type="text"
                      v-model="gender"
                    ></v-text-field>
                    <br />
                    <div class="danger-alert" v-html="error" />
                    <br />
                  </form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="register"
                    >Registriraj se</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import AuthenticationServices from '@/services/AuthenticationServices'
export default {
  data() {
    return {
      email: '',
      password: '',
      name: '',
      surname: '',
      gender: '',
      error: null
    }
  },
  methods: {
    async register() {
      try {
        await AuthenticationServices.register({
          email: this.email,
          password: this.password,
          name: this.name,
          surname: this.surname,
          gender: this.gender
        })
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style scoped>
#inspire {
  background: url(../assets/BetterOne.jpg);
}
</style>
