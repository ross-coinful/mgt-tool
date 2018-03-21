<template>
  <BaseCard type="activity" :id="id">
    <p>{{ card.title }}</p>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/BaseCard';
import store from '../stores';

export default {
  name: 'ActivityCard',
  props: {
    id: {
      type: Number,
      require: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  store,
  components: {
    BaseCard: BaseCard
  },
  computed: {
    card () {
      return this.$store.getters.activityCard(this.id, this.index);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
