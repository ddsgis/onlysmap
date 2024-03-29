import Cookies from 'js-cookie';

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    fflist: []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
    SET_FFLIST(state, fflist) {
      state.fflist = fflist;
    }
  },
  actions: {
    ToggleSideBar: ({
      commit
    }) => {
      commit('TOGGLE_SIDEBAR');
    },
    CloseSideBar({
      commit
    }, {
      withoutAnimation
    }) {
      commit('CLOSE_SIDEBAR', withoutAnimation);
    },
    ToggleDevice({
      commit
    }, device) {
      commit('TOGGLE_DEVICE', device);
    },
    getFFList({
      commit
    }, fflist) {
      commit('SET_FFLIST', fflist);
    }
  }
};

export default app;
