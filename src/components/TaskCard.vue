<template>
  <BaseCard type="task" :id="id">
    <p class="card-title" v-if="card.title">{{ card.title }}</p>
    <p v-else class="empty-title">{{ emptyCard }}</p>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/BaseCard';
import { emptyCard } from '../../data';

export default {
  name: 'TaskCard',
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      emptyCard
    };
  },
  computed: {
    card () {
      return this.$store.getters.card(this.id);
    }
  },
  components: {
    BaseCard: BaseCard
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
