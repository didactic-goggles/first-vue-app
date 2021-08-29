<template>
<section class="container">
  <div class="mb-3">
    <router-link to="/" class="text-decoration-none text-dark fw-bold">
      <i class="bi bi-arrow-left-short me-2"></i>
      <span>Return to List</span>
    </router-link>
  </div>
  <form class="needs-validation" novalidate @submit.prevent="onSubmit" ref="refForm">
    <div class="mb-3">
      <label for="inputLinkName" class="form-label">Link name:</label>
      <input type="text" class="form-control" id="inputLinkName" placeholder="e.g. Alphabet" required v-model="name">
      <div class="invalid-feedback">
        Please input a valid name
      </div>
    </div>
    <div class="mb-3">
      <label for="inputLinkUrl" class="form-label">Link url:</label>
      <input type="url" class="form-control" id="inputLinkUrl" placeholder="e.g. http://abc.xyz" required v-model="url">
      <div class="invalid-feedback">
        Please input a valid url
      </div>
    </div>
    <div class="d-flex justify-content-end">
      <button class="btn btn-dark br-100 min-w-120px" type="submit">ADD</button>
    </div>
  </form>
  <div class="toast-add-after-container p-3">
    <div id="addAfterToast" class="toast align-items-center hide" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-body text-center">
        <h3><b>{{createdLink && createdLink.name}}</b> added.</h3>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import * as bootstrap from 'bootstrap'

const getLinks = () => {
  let links;
  try {
    links = JSON.parse(localStorage.getItem(process.env.VUE_APP_LOCAL_STORAGE_KEY) || '[]')
  } catch {
    links = []
  }
  return links
}

const saveLink = (createdLink) => {
    const links = getLinks()
    links.push(createdLink)
    localStorage.setItem(process.env.VUE_APP_LOCAL_STORAGE_KEY, JSON.stringify(links))
}
export default {
  name: "LinkList",
  data() {
    return {
      name: '',
      url: '',
      createdLink: null
    };
  },
  methods: {
      onSubmit() {
        const createdLink = {
          id: new Date(),
          name: this.name,
          url: this.url,
          vote: 0,
          created: new Date()
        }
        this.createdLink = createdLink
        const form =this.$refs.refForm
        const formStatus = form.checkValidity()
        if (!formStatus) {
          form.classList.add('was-validated')
          return
        }
        saveLink(createdLink)
        this.name = ''
        this.url = ''
        form.classList.remove('was-validated')
        this.showToast()
      },
    showToast() {
      const addAfterToast = bootstrap.Toast.getOrCreateInstance(document.getElementById('addAfterToast'))
      addAfterToast.show()
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
</style>
