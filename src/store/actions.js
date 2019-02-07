export default {
  updateUser ({ commit }, user) {
    const userId = user['.key']

    commit('updateUser', { user, userId })
  },

  createPost ({ commit, state }, post) {
    const postId = 'greatPost' + Math.random()

    post.publishedAt = Math.floor(Date.now() / 1000)
    post.userId = state.sourceData.authId
    post['.key'] = postId

    commit('setPost', { post, postId })
    commit('addPostToThread', { threadId: post.threadId, postId })
    commit('addPostToUser', { userId: post.userId, postId })
  },

  createThread ({ commit, state, dispatch }, { thread, text }) {
    const threadId = 'greatPost' + Math.random()

    thread.publishedAt = Math.floor(Date.now() / 1000)
    thread.userId = state.sourceData.authId
    thread['.key'] = threadId

    commit('setThread', { thread, threadId })

    dispatch('createPost', { text, threadId })
  }
}
