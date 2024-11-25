import { defineComponent } from 'vue'
import Avatar from '@/components/Avatar'

export default defineComponent({
  props: {
    avatar: {
      type: String,
      default: () => 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg'
    },
    comerId: {
      type: Number,
      require: true
    }
  },
  render() {
    const toComerDetail = (id?: number) => () => {
      if (id) {
        this.$router.push({ path: '/builder', query: { id } })
      } else {
        console.warn('toComerDetail(): missing param [id]')
      }
    }
    return (
      <div class="flex">
        <Avatar
          class="!h-9 !w-9"
          avatar={this.avatar}
          onClickAvatar={toComerDetail(this.comerId)}
        />
        {this.$slots.default ? this.$slots.default() : null}
      </div>
    )
  }
})
