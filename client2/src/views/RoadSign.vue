<template>
  <div class="container">
    <div class="box">
      <span></span>
      <div class="content">
        <h2>Znakovi Opasnosti</h2>
        <router-link class="signs" :to="{ name: 'ZnakoviOpasnosti' }"
          >Kreni</router-link
        >
      </div>
    </div>
    <div class="box">
      <span></span>
      <div class="content">
        <h2>Znakovi Izričitih Naredbi</h2>
        <router-link class="signs" :to="{ name: 'ZnakoviIzricitihNaredbi' }"
          >Kreni</router-link
        >
      </div>
    </div>
    <div class="box">
      <span></span>
      <div class="content">
        <h2>Znakovi Obavijesti</h2>
        <router-link class="signs" :to="{ name: 'ZnakoviObavijesti' }"
          >Kreni</router-link
        >
      </div>
    </div>
    <div class="box">
      <span></span>
      <div class="content">
        <h2>Znakovi za Vođenje Prometa</h2>
        <router-link class="signs" :to="{ name: 'ZnakoviZaVodenjePrometa' }"
          >Kreni</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

h1 {
  position: fixed;
  display: flex;
  top: 10%;
  left: 38%;
  color: white;
  font-size: 70px;
}

.container {
  overflow-y: scroll;
  position: absolute;
  display: flex;
  justify-content: center;
  background: rgba(141, 140, 140, 0.21);
  align-items: center;
  padding: 40px 0;
  flex-wrap: wrap;
  width: 70%;
  height: 75%;
  top: 20%;
  left: 15%;
  border-radius: 50px;
}
::-webkit-scrollbar {
  width: 9px;
}

::-webkit-scrollbar-thumb {
  background: lightgray;
  border-collapse: collapse;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.container .box {
  position: relative;
  width: 300px;
  height: 200px;
  color: #fff;
  background: #111;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 70px;
  margin-top: 40px;
  transition: 0.5s;
}
.container .box:hover {
  transform: translateY(-20px);
}

.container .box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(315deg, #222222, #575556);
}
.container .box::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(315deg, #222222, #575556);
  filter: blur(30px);
}

.container .box:nth-child(2)::before,
.container .box:nth-child(2)::after {
  background: linear-gradient(315deg, #222222, #575556);
}

.container .box:nth-child(3)::before,
.container .box:nth-child(3)::after {
  background: linear-gradient(315deg, #222222, #575556);
}

.container .box:nth-child(4)::before,
.container .box:nth-child(4)::after {
  background: linear-gradient(315deg, #222222, #575556);
}
.container .box:nth-child(5)::before,
.container .box:nth-child(5)::after {
  background: linear-gradient(315deg, #03a9f4, #ff0058);
}
.container .box:nth-child(6)::before,
.container .box:nth-child(6)::after {
  background: linear-gradient(315deg, #4dff03, #00d0ff);
}

.container .box:nth-child(7)::before,
.container .box:nth-child(7)::after {
  background: linear-gradient(315deg, #03a9f4, #ff0058);
}

.container .box span {
  position: absolute;
  top: 6px;
  left: 6px;
  right: 6px;
  bottom: 6px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2;
}

.container .box .content {
  position: relative;
  z-index: 10;
  padding: 20px 40px;
}

.container .box .content h2 {
  font-size: 20px;
  color: #fff;
  margin-bottom: 10px;
}

.container .box .content .signs {
  position: absolute;
  border-radius: 60%;
  left: 40%;
  font-size: 15px;
  color: #111;
  background: #fff;
  padding: 10px;
  text-decoration: none;
  font-weight: 400;
}
</style>
