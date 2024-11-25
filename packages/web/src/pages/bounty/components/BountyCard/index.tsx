// import { services } from '@/services'
import { defineComponent, PropType } from 'vue'
import BountyCard from './BountyCard'
import MobileBountyCard from './MobileBountyCard'
import { useGlobalConfigStore } from '@/stores'
import { BountyListItem } from '@/types'

export default defineComponent({
  name: 'BountyCard',
  props: {
    info: {
      type: Object as PropType<BountyListItem>,
      required: true
    },
    miniCard: {
      type: Boolean
    }
  },
  setup(props, ctx) {
    const globalConfigStore = useGlobalConfigStore()
    return {
      globalConfigStore
    }
  },
  render() {
    return this.globalConfigStore.isLargeScreen ? (
      <BountyCard {...this.$props} />
    ) : (
      <MobileBountyCard {...this.$props} />
    )
  }
})
