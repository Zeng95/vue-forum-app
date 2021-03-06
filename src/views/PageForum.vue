<template>
  <div v-if="asyncDataStatus_ready" class="forum-wrapper col-full">
    <div class="forum-header push-top">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>

        <p class="text-lead">{{ forum.description }}</p>
      </div>

      <router-link
        :to="{ name: 'ThreadCreate', params: { forumId: this.forumId } }"
        class="btn-green btn-small"
        >Start a thread</router-link
      >
    </div>

    <div class="category-item">
      <div class="forum-list">
        <h2 class="list-title">Recipes</h2>

        <div class="forum-listing">
          <div class="forum-details">
            <a href="#" class="forum-name">Recipes</a>

            <p class="forum-description">
              Recipes, Guides and Tips &amp; Tricks
            </p>
          </div>

          <div class="threads-count">
            <p class="count text-lead">1</p>
            threads
          </div>

          <div class="last-thread">
            <img
              class="avatar"
              src="http://cleaneatsfastfeets.com/wp-content/uploads/2013/05/Mr-Burns.gif"
              alt
            />
            <div class="last-thread-details">
              <a href="#">How I grill my fish</a>
              <p class="text-xsmall">
                By
                <a href="profile.html">Charles Montgomery Burns</a>, 2 days ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="thread-wrapper">
      <h2 class="list-title">Threads</h2>

      <ThreadList :threads="forumThreads" />
    </div>
  </div>
</template>

<script>
import ThreadList from '@/components/ThreadList'
import { mapState, mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  mixins: [asyncDataStatus],

  components: {
    ThreadList
  },

  props: {
    forumId: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapState({
      forums: state => state.forums.items,
      threads: state => state.threads.items
    }),

    forum() {
      return this.forums[this.forumId]
    },

    forumThreads() {
      // need to return an array of threads
      return Object.values(this.threads).filter(
        thread => thread.forumId === this.forumId
      )
    }
  },

  methods: {
    ...mapActions({
      fetchForum: 'forums/fetchForum',
      fetchThreads: 'threads/fetchThreads',
      fetchPost: 'posts/fetchPost',
      fetchUser: 'users/fetchUser'
    })
  },

  created() {
    this.fetchForum({ id: this.forumId })
      .then(forum => this.fetchThreads({ ids: forum.threads }))
      .then(threads => {
        threads.forEach(thread => this.fetchUser({ id: thread.userId }))
        return threads
      })
      .then(threads =>
        Promise.all(
          threads.map(thread => this.fetchPost({ id: thread.lastPostId }))
        )
      )
      .then(posts =>
        Promise.all(posts.map(post => this.fetchUser({ id: post.userId })))
      )
      .then(this.asyncDataStatus_fetched)
  }
}
</script>
