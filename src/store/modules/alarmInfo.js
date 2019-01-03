const alarmInfo = {
  state: {
    showAlarm: false
  },
  mutations: {
    SHOW_ALARM: (state, showAlarm) => {
      state.showAlarm = showAlarm
    }
  },
  actions: {
    isShow({ commit }) {
      commit('SHOW_ALARM')
    }
  }
}

export default alarmInfo
