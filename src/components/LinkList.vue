<template>
  <section class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <router-link to="/create" class="text-decoration-none text-dark">
          <div class="card bg-light">
            <div class="card-body d-flex p-2">
              <div class="bg-secondary d-flex flex-column align-items-center justify-content-center me-3 px-4 py-2 rounded border w-100px h-100px">
                <h1 class="fw-bolder mb-1">
                  <i class="bi bi-plus-lg fw-bold"></i>
                </h1>
              </div>
              <div class="flex-fill d-flex align-items-center">
                <h3 class="fw-bold mb-1">SUBMIT A LINK</h3>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <hr class="my-4"/>
    <div class="row" v-if="slicedLinks.length > 0">
      <div class="col-sm-6 col-lg-3 mb-3">
        <select class="form-select form-select-sm" aria-label="Sort links" @change="sortLinks" v-model="sort">
          <option value="" selected>Order by</option>
          <option value="vote:desc">Vote - High to Low</option>
          <option value="vote:asc">Vote - Low to High</option>
          <!-- <option value="created:desc">Created - Newest to Oldest</option>
          <option value="created:asc">Created - Oldest to Newest</option> -->
        </select>
      </div>
    </div>
    <div class="row" v-if="slicedLinks.length > 0">
      <transition-group name="link" tag="div" class="col-md-6 mb-2" v-for="link in slicedLinks" :key="link.id">
        <div class="card link-item" :key="link.id">
          <div class="card-body d-flex p-2">
            <div class="link-vote bg-secondary d-flex flex-column align-items-center justify-content-center me-3 px-4 py-2 rounded border w-100px">
              <h2 class="link-vote-number fw-bolder mb-1">{{link.vote}}</h2>
              <span class="link-vote-text">{{link.vote > 1 ? 'POINTS' : 'POINT'}}</span>
            </div>
            <div class="link-info flex-fill">
              <div class="link-description mb-2">
                <h3 class="fw-bold mb-1">{{link.name}}</h3>
                <h5 class="text-muted mb-0">({{link.url}})</h5>
              </div>
              <div class="link-actions w-75 d-flex justify-content-between">
                <button class="btn btn-light link-action-button fw-bold" @click="updateLinkVote(link, 'up')">
                  <i class="bi bi-arrow-up-short me-2 fw-bold"></i>
                  <span>Up Vote</span>
                </button>
                <button class="btn btn-light link-action-button fw-bold" @click="updateLinkVote(link, 'down')">
                  <i class="bi bi-arrow-down-short me-2 fw-bold"></i>
                  <span>Down Vote</span>
                </button>
              </div>
            </div>
            <div class="link-remove">
              <button class="btn btn-link link-remove-button" @click="showConfirmationBeforeRemove(link)">
                <!-- <i class="bi bi-dash-circle"></i> -->
                </button>
              </div>
          </div>
        </div>
      </transition-group>
      <div v-if="links.length > 5" class="col-12">
        <nav aria-label="Page navigation example">
          <ul class="pagination justify-content-center fw-bold">
            <li class="page-item me-3" :class="activePage === 1 && 'disabled'">
              <a class="page-link" href="#" aria-label="Previous" 
                @click="onPagination($event, activePage - 1)" 
                v-bind:aria-disabled="activePage === 1">
                <span aria-hidden="true">
                  <i class="bi bi-chevron-left fw-bold"></i>
                </span>
              </a>
            </li>
            <li class="page-item" v-for="i in Math.ceil(links.length / 5)" :key="i" :class="i === 1 ? 'active' : ''" >
              <a class="page-link" href="#" @click="onPagination($event, i)">{{i}}</a>
            </li>
            <li class="page-item ms-3" :class="activePage === Math.ceil(links.length / 5) && 'disabled'">
              <a class="page-link" href="#" aria-label="Next" 
                @click="onPagination($event, activePage + 1)"
                v-bind:aria-disabled="activePage === Math.ceil(links.length / 5)">
                <span aria-hidden="true">
                  <i class="bi bi-chevron-right fw-bold"></i>
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div v-else>
      No Items
    </div>
    <div id="removeModal" class="modal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header px-2 py-1 bg-black text-white border-dark">
            <h5 class="modal-title">Remove Link</h5>
            <button type="button" class="btn-close fs-6 btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body bg-light">
            <h5 class="text-center text-muted">Do you want to remove?</h5>
            <h1 class="text-center">{{selectedLink && selectedLink.name}}</h1>
          </div>
          <div class="modal-footer py-1 border-0 bg-light justify-content-center">
            <button type="button" class="btn btn-dark br-100 min-w-120px" @click="removeLink(selectedLink.id)">OK</button>
            <button type="button" class="btn btn-dark br-100 min-w-120px" data-bs-dismiss="modal">CANCEL</button>
          </div>
        </div>
      </div>
    </div>
    <div class="toast-remove-after-container p-3">
      <div id="removeAfterToast" class="toast align-items-center hide" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-body text-center">
          <h3><b>{{selectedLink && selectedLink.name}}</b> removed.</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// Animasyonlar için kullandığım kaynak
// https://vuejs.org/v2/guide/transitions.html

import * as bootstrap from 'bootstrap'

const getLinks = () => {
  let links;
  try {
    links = JSON.parse(localStorage.getItem(process.env.VUE_APP_LOCAL_STORAGE_KEY))
    links = links.sort((link1, link2) => new Date(link1.created) < new Date(link2.created) ? 1 : -1)
  } catch {
    links = []
  }
  return links
}

const saveLinks = (links) => localStorage.setItem(process.env.VUE_APP_LOCAL_STORAGE_KEY, JSON.stringify(links))

export default {
  name: "LinkList",
  data() {
    return {
      links: getLinks(),
      slicedLinks: getLinks().slice(0, 5),
      selectedLink: null,
      sort: "",
      activePage: 1,
    };
  },
  methods: {
    updateLinkVote(link, type) {
      const linkIndex = this.links.findIndex(li => li.id === link.id)
      if (linkIndex > -1) {
        const linkItem = this.links[linkIndex]
        if(type === 'up') linkItem.vote += 1
        else linkItem.vote -= 1
        saveLinks(this.links)
        this.sortLinks()
      }
    },
    showConfirmationBeforeRemove(link) {
      this.selectedLink = link
      this.toggleModal()
    },
    removeLink(linkId) {
      this.links = this.links.filter(l => l.id !== linkId)
      saveLinks(this.links)
      this.setSlicedLinks(this.activePage)
      this.toggleModal()
      this.showToast()
    },
    toggleModal() {
      const removeModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#removeModal'))
      removeModal.toggle()
    },
    showToast(){
      const removeAfterToast = bootstrap.Toast.getOrCreateInstance(document.getElementById('removeAfterToast'))
      removeAfterToast.show()
    },
    sortLinks() {
      this.links = this.links.sort((link1, link2) => {
        // console.log(link1.vote, link2.vote)
        // const sortField = this.sort.split(':')[0]
        const sortType = this.sort.split(':')[1]
        // if (sortField === 'created') {
        //   if (sortType === 'asc') return new Date(link1.created) < new Date(link2.created) ? -1 : 1
        //   return new Date(link1.created) > new Date(link2.created) ? -1 : 1
        // } else if (sortField === 'vote') {
          if (sortType === 'asc') {
            if (link1.vote < link2.vote) return -1
            else if (link1.vote > link2.vote) return 1
            else if (new Date(link1.created) < new Date(link2.created)) return 1
            else return -1
              // return link1.vote < link2.vote ? -1 : 
              //   link1.vote === link2.vote ? new Date(link1.created) < new Date(link2.created) ? 1 : -1 : 1
          } else {
            if (link1.vote < link2.vote) return 1
            else if (link1.vote > link2.vote) return -1
            else if (new Date(link1.created) < new Date(link2.created)) return 1
            else return -1
          }
          // return link1.vote > link2.vote ? -1 : 1
        // }
      })
      this.setSlicedLinks(this.activePage)
    },
    onPagination(event, i) {
      event.preventDefault()
      this.activePage = i
      const paginationLinkParent = [...document.querySelectorAll('.page-item')][i]
      const allPaginationLinksParents = [...document.querySelectorAll('.page-item.active')]
      allPaginationLinksParents.filter(pl => pl !== paginationLinkParent).forEach(pl => {
        pl.classList.remove('active')
      })
      paginationLinkParent.classList.add('active')
      this.setSlicedLinks(i)
    },
    setSlicedLinks(i) {
      this.slicedLinks = this.links.slice((i - 1)*5, ((i - 1)*5)+5)
    }
  }
};
</script>

<style scoped>

.link-enter-active, .link-leave-active {
  transition: all 1s;
}
.link-enter, .link-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

</style>
