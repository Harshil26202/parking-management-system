import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
const store = createStore({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ],
  state () {
    return {
      toggle: false,
      isAdmin: false,
      owner: null,
      isOwner: false
    }
  },
  mutations: {
    onToggle (state) {
      state.toggle = !state.toggle
    },
    checkIsAdmin (state, payload) {
      state.isAdmin = payload
    },
    changeRole (state) {
      state.isOwner = !state.isOwner
      console.log(state.isOwner)
    }
  },
  actions: {
    onToggle (context) {
      context.commit('onToggle')
    },
    checkIsAdmin (context, payload) {
      const isAdmin = payload.isAdmin
      context.commit('checkIsAdmin', isAdmin)
    },
    changeRole (context) {
      context.commit('changeRole')
    }
  },
  getters: {
    toggle (state) {
      return state.toggle
    },
    isAdmin (state) {
      return state.isAdmin
    },
    isOwner (state) {
      return state.isOwner
    },
    isAuth () {
      if (localStorage.getItem('token') === null) {
        return false
      }
      return true
    }
  }
})

export default store
