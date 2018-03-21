<template>
  <BaseCard type="task" :id="id">
    <p>{{ card.title }}</p>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/BaseCard';

export default {
  name: 'TaskCard',
  props: {
    id: {
      type: Number,
      require: true
    },
    index: {
      type: Number,
      require: true
    }
  },
  computed: {
    card () {
      console.log('id', this.id);
      return this.$store.getters.taskCard(this.id);
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
