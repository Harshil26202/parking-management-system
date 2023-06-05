import { createRouter, createWebHistory } from 'vue-router'

// components
import SignIn from './components/auth/SignIn.vue'
import SignUp from './components/auth/SignUp.vue'
import OwnerHome from './components/owner/OwnerHome.vue'
import AdminHome from './components/admin/AdminHome.vue'
import NotFound from './components/ui/NotFound.vue'
import OwnerList from './components/shared/OwnerList.vue'
import ParkingMap from './components/shared/ParkingMap.vue'
import EditProfile from './components/shared/EditProfile.vue'
import ChangePassword from './components/shared/ChangePassword.vue'
import WrongParking from './components/owner/requests/WrongParking.vue'
import ResolveWrongParking from './components/owner/requests/ResolveWrongParking.vue'
import VehicleList from './components/owner/VehicleList.vue'
import ResolvePenalties from './components/owner/requests/ResolvePenalties.vue'
import HomeData from './components/admin/HomeData.vue'
import GuestParking from './components/owner/requests/GuestParking.vue'
import AddOwner from './components/admin/requests/AddOwner.vue'
import AddVehicle from './components/admin/requests/AddVehicle.vue'
import ApproveWrongParking from './components/admin/requests/WrongParking.vue'
import PenaltiesApprovement from './components/admin/requests/PenaltiesApprovement.vue'
import GuestParkingRequest from './components/admin/requests/GuestParking.vue'
import ChatComponent from './components/shared/ChatComponent.vue'
import store from './store/index.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/signin' },
    { path: '/signin', component: SignIn, meta: { requiresUnauth: true } },
    { path: '/signup', component: SignUp },
    {
      path: '/owner',
      redirect: '/owner/home',
      component: OwnerHome,
      meta: { requiresAuth: true, requiresAdmin: false },
      children: [
        { path: 'home', component: VehicleList, meta: { requiresAuth: true, requiresAdmin: false } },
        { path: 'edit-profile', component: EditProfile, meta: { requiresAuth: true, requiresAdmin: false } },
        { path: 'change-password', component: ChangePassword, meta: { requiresAuth: true, requiresAdmin: false } },
        { path: 'chat', component: ChatComponent, meta: { requiresAuth: true, requiresAdmin: false } },
        { path: 'search', component: OwnerList, meta: { requiresAuth: true, requiresAdmin: false } },
        { path: 'map', component: ParkingMap, meta: { requiresAuth: true, requiresAdmin: false } },
        { path: 'wrong-parking', component: WrongParking, meta: { requiresAuth: true, requiresAdmin: false } },
        { path: 'resolve-wrong-parking', component: ResolveWrongParking, meta: { requiresAuth: true, requiresAdmin: false } },
        { path: 'resolve-penalties', component: ResolvePenalties, meta: { requiresAuth: true, requiresAdmin: false } },
        { path: 'guest-parking', component: GuestParking, meta: { requiresAuth: true, requiresAdmin: false } }
      ]
    },
    {
      path: '/admin',
      redirect: '/admin/home',
      component: AdminHome,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: 'home', component: HomeData, meta: { requiresAuth: true, requiresAdmin: true } },
        { path: 'edit-profile', component: EditProfile, meta: { requiresAuth: true, requiresAdmin: true } },
        { path: 'chat', component: ChatComponent, meta: { requiresAuth: true, requiresAdmin: true } },
        { path: 'change-password', component: ChangePassword, meta: { requiresAuth: true, requiresAdmin: true } },
        { path: 'search', component: OwnerList, meta: { requiresAuth: true, requiresAdmin: true } },
        { path: 'map', component: ParkingMap, meta: { requiresAuth: true, requiresAdmin: true } },
        { path: 'add-owner', component: AddOwner, meta: { requiresAuth: true, requiresAdmin: true } },
        { path: 'add-vehicle', component: AddVehicle, meta: { requiresAuth: true, requiresAdmin: true } },
        { path: 'wrong-parking', component: ApproveWrongParking, meta: { requiresAuth: true, requiresAdmin: true } },
        { path: 'penalties', component: PenaltiesApprovement, meta: { requiresAuth: true, requiresAdmin: true } },
        { path: 'guest-parking', component: GuestParkingRequest, meta: { requiresAuth: true, requiresAdmin: true } }
      ]
    },
    { path: '/:notFound(.*)', component: NotFound }
  ]
})
router.beforeEach(function (to, from, next) {
  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin

  if (requiresAuth && !store.getters.isAuth) {
    next('/signin')
  } else if (requiresAdmin && !store.getters.isAdmin) {
    next('/notfound')
  } else {
    next()
  }
})

export default router
