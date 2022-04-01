import axios from 'axios'

const BASE_URL = process.env.VUE_APP_API_URL + 'api/';
const accessToken = localStorage.getItem('access_token')

const base = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + accessToken
    }
})

const Api = {
    login(data) {
        return base.post('login', data)
    },

    logout(user) {
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
        localStorage.removeItem('expire_at')

        return base.post('logout', user)
    },

    isLogged(token) {
        if (localStorage.getItem('access_token') !== null) {
            return base
                .post('check-token', token)
                .then(res => {
                    
                    if(!res.data.response) {
                        localStorage.removeItem('user')
                        localStorage.removeItem('access_token')
                        localStorage.removeItem('expire_at')

                        return false
                    }

                    return true
                })
                .catch(() => {
                    localStorage.removeItem('user')
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('expire_at')

                    return false
                })
        } else {
            return false
        }
    },

    // USERS
    listUsers() {
        return base.get('users')
    },

    storeUsers(data) {
        return base.post('users', data)
    },

    updateUsers(id, data) {
        return base.put('users/'+id, data)
    },

    deleteUsers(id) {
        return base.delete('users/'+id)
    },

    // SCHEDULES
    listSchedules() {
        return base.get('schedules')
    },

    storeSchedules(data) {
        return base.post('schedules', data)
    },

    updateSchedules(id, data) {
        return base.put('schedules/'+id, data)
    },

    deleteSchedules(id) {
        return base.delete('schedules/'+id)
    },

    // PEOPLE
    listPeople(type) {
        return base.get('people/' + type)
    },

    // CLASS BLOCK
    listClassBlock() {
        return base.get('class-block')
    },

    storeClassBlock(data) {
        return base.post('class-block', data)
    },

    // PACKAGES
    listPackages() {
        return base.get('packages')
    },

    storePackages(data) {
        return base.post('packages', data)
    },

    updatePackages(id, data) {
        return base.put('packages/'+id, data)
    },

    deletePackages(id) {
        return base.delete('packages/'+id)
    },

    // NOTIFICATIONS
    listNotifications() {
        return base.get('notifications')
    },

    storeNotifications(data) {
        return base.post('notifications', data)
    },

    updateNotifications(id, data) {
        return base.put('notifications/'+id, data)
    },

    deleteNotifications(id) {
        return base.delete('notifications/'+id)
    },
}

export default Api