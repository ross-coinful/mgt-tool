<template>
  <BaseCard type="activity" :id="id">
    <p class="card-title" v-if="card.title">{{ card.title }}</p>
    <p v-else class="empty-title">{{ emptyCard }}</p>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/BaseCard';
import { emptyCard } from '../../data';

export default {
  name: 'ActivityCard',
  props: {
    id: {
      type: Number,
      require: true
    }
  },
  data () {
    return {
      emptyCard
    };
  },
  components: {
    BaseCard: BaseCard
  },
  computed: {
    card () {
      return this.$store.getters.card(this.id);
    }
  }
};
</script>
