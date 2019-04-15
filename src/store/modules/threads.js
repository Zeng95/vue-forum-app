import { database } from '@/firebase.config'
import { SET_THREAD, ADD_POST_TO_THREAD, ADD_CONTRIBUTOR_TO_THREAD } from '../mutation-types'
import { countObjectProperties, makeSetItemMutation, makeAppendChildToParentMutation } from '../assetHelpers'

export default {
  namespaced: true,

  state: {
    items: {} // store.state.threads.items[id]
  },

  mutations: {
    [SET_THREAD]: makeSetItemMutation(),

    [ADD_CONTRIBUTOR_TO_THREAD]: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' }),

    [ADD_POST_TO_THREAD]: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }) // Accept a parent id and a child id.
  },

  actions: {
    createThread: ({ commit, state, rootState }, { forumId, title, text }) =>
      new Promise((resolve, reject) => {
        const threadId = database.ref().child('threads').push().key
        const postId = database.ref().child('posts').push().key
        const thread = {}
        const post = {}

        thread.contributors = state.authId
        thread.firstPostId = postId
        thread.forumId = forumId
        thread.lastPostId = postId

        thread.posts = {
          [postId]: postId
        }

        thread.publishedAt = Math.floor(Date.now() / 1000)
        thread.title = title
        thread.userId = state.authId

        post.publishedAt = Math.floor(Date.now() / 1000)
        post.text = text
        post.threadId = threadId
        post.userId = state.authId

        var updates = {}
        updates[`/threads/${threadId}`] = thread
        updates[`/forums/${thread.forumId}/threads/${threadId}`] = threadId
        updates[`/users/${thread.userId}/threads/${threadId}`] = threadId

        updates[`/posts/${postId}`] = post
        updates[`/users/${post.userId}/posts/${postId}`] = postId

        database.ref().update(updates).then(() => {
          // Update post.
          commit('SET_ITEM', { resource: 'threads', id: threadId, item: thread })
          commit('ADD_THREAD_TO_FORUM', { parentId: forumId, childId: threadId })
          commit('ADD_THREAD_T0_USER', { parentId: thread.userId, childId: threadId })

          // Update thread.
          commit('SET_ITEM', { resource: 'posts', id: postId, item: post })
          commit('ADD_POST_TO_THREAD', { parentId: threadId, childId: postId })
          commit('ADD_POST_TO_USER', { parentId: post.userId, childId: postId })

          resolve(state.items[threadId])
        })
      }),

    updateThread: ({ commit, state, rootState }, { threadId, title, text }) =>
      new Promise((resolve, reject) => {
        const { posts, authId } = state
        const thread = state.items[threadId]
        const post = posts[thread.firstPostId]

        const edited = { at: Math.floor(Date.now() / 1000), by: authId }

        const updates = {}
        updates[`/threads/${threadId}/title`] = title
        updates[`/posts/${thread.firstPostId}/edited`] = edited
        updates[`/posts/${thread.firstPostId}/text`] = text

        database.ref().update(updates).then(() => {
          commit('SET_THREAD', { id: threadId, item: { ...thread, title } })
          commit('SET_POST', { id: thread.firstPostId, item: { ...post, text, edited } })

          resolve(state.items[threadId])
        })
      }),

    fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { id, resource: 'threads' }, { root: true }),

    fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'threads' }, { root: true })
  },

  getters: {
    // higher order function
    threadRepliesCount: state => {
      return id => {
        const count = countObjectProperties(state.items[id].posts)
        return count ? count - 1 : count
      }
    }
  }
}
