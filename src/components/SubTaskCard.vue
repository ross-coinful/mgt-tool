<template>
  <BaseCard type="subtask" :id="id">
    <p>{{ card.title }}</p>

    <Dropdown class="label-dropdown" placement="bottom-start" @on-click="setProgress">
      <a href="javascript:void(0)" :class="['label-text', progress]">{{ upperProgress }}</a>
      <DropdownMenu slot="list">
        <DropdownItem name="done" :disabled="progress === 'done'">Done</DropdownItem>
        <DropdownItem name="doing" :disabled="progress === 'doing'">Doing</DropdownItem>
        <DropdownItem name="ready" :disabled="progress === 'ready'">Ready</DropdownItem>
        <DropdownItem name="todo" :disabled="progress === 'todo'">Todo</DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <p>Points:</p>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/BaseCard';

export default {
  name: 'SubTaskCard',
  props: {
    id: {
      type: Number,
      require: true
    },
    title: {
      type: String,
      require: true
    }
  },
  components: {
    BaseCard: BaseCard
  },
  computed: {
    upperProgress () {
      return this.progress[0].toUpperCase() + this.progress.substr(1);
    },
    card () {
      return this.$store.getters.card(this.id);
    }
  },
  data () {
    return {
      progress: 'todo'
    };
  },
  methods: {
    setProgress (progress) {
      this.progress = progress;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.label-dropdown {
  position: absolute;
  z-index: 1;
  left: 3px;
  bottom: -1px;
}

.label-text {
  color: #eee;
  padding: 2px 5px;
}

.todo {
  background-color: #999;
}

.doing {
  background-color: #00abe1;
}

.ready {
  background-color: #FF705A;
}

.done {
  background-color: #14c63e;
}
</style>
