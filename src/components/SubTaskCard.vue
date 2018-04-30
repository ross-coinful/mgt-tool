<template>
  <BaseCard type="subtask" :id="id">
    <p v-if="card.title">{{ card.title }}</p>
    <p v-else class="empty-title">{{ emptyCard }}</p>

    <div class="label-dropdown" @mouseout="closeDropdown">
      <span class="label-text" :style="style" @click.prevent.stop="open = !open">{{ upperLabel(activeLabelTitle) }}</span>
      <div @mouseover="openDropdown" class="dropdown" v-if="open">
        <div
          v-for="label in labelList"
          :class="setClass(label.title)"
          :data-id="label.id"
          :key="label.id"
          @click.prevent.stop="setProgress"
        >
          {{ upperLabel(label.title) }}
        </div>
      </div>
    </div>

    <p>Points:</p>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/BaseCard';
import { emptyCard, labelList } from '../../data';

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
    activeLabel () {
      const labelId = this.$store.getters.card(this.id).labelId;
      const label = this.labelList.find(label => label.id === labelId);

      return label || null;
    },
    activeLabelTitle () {
      return this.activeLabel ? this.activeLabel.title : '';
    },
    activeLabelId () {
      return this.activeLabel ? this.activeLabel.id : null;
    },
    card () {
      return this.$store.getters.card(this.id);
    },
    style () {
      const labelId = this.$store.getters.card(this.id).labelId;
      const label = this.labelList.find(label => label.id === labelId);

      return label ? `background-color: ${label.color}` : '';
    }
  },
  data () {
    return {
      labelList,
      progress: '',
      open: false,
      emptyCard
    };
  },
  methods: {
    setProgress (event) {
      const labelId = parseInt(event.target.dataset.id, 10);

      if (labelId === this.activeLabelId) {
        return false;
      }

      this.$store.dispatch('updateCard', [{
        id: parseInt(this.id, 10),
        labelId
      }]);
      this.open = false;
    },
    upperLabel (title) {

      if (title.length > 0) {
        return title[0].toUpperCase() + title.substr(1);
      }
      return title;
    },
    setClass (label) {
      return `dropdown-item ${this.activeLabelTitle === label ? 'disable' : ''}`;
    },
    closeDropdown () {
      this.timer = setTimeout(() => {
        this.open = false;
      }, 200);
    },
    openDropdown () {
      clearTimeout(this.timer);
      this.open = true;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.label-dropdown {
  position: absolute;
  left: 3px;
  bottom: -1px;
}

.dropdown {
  position: absolute;
  z-index: 10;
  color: #fff;
  background-color: #999;
}

.dropdown-item {
  padding-left: 4px;
  padding-right: 4px;
}

.dropdown-item:hover {
  background-color: #00abe1;
}

.dropdown-item.disable {
  color: #888;
}

.label-text {
  position: relative;
  z-index: 9;
  color: #eee;
  padding: 2px 5px;
}
</style>
