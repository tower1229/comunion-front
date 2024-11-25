import { UButton } from '@comunion/components'
import { PlusFilled } from '@comunion/icons'
import { defineComponent, onMounted, onUnmounted, ref, computed, PropType } from 'vue'
import { useRouter } from 'vue-router'
import ULogo from '@/components/ULogo'
import type { ComerProfileState } from '@/types'

const indexUrl = import.meta.env.VITE_COMUNION_HOMEPAGE_URL
const ProfileHeader = defineComponent({
  name: 'ProfileHeader',
  props: {
    profile: {
      type: Object as PropType<ComerProfileState>,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const sticky = ref<string>('')
    const onScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 0) {
        sticky.value = 'bg-white/80'
      } else {
        sticky.value = ''
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', onScroll, true)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll, true)
    })

    const styles = computed(() => {
      if (sticky.value !== '') {
        return {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(34px)'
        }
      }
      return {}
    })

    const headerClass = computed(() => {
      const str = 'flex h-16 px-4 xl:px-8 items-center z-9 fixed w-full top-0'
      if (sticky.value !== '') {
        return `${str} ${sticky.value}`
      }
      return str
    })

    const toComerDetail = () => {
      if (props.profile) {
        router.push({ path: '/builder', query: { id: props.profile.id } })
      } else {
        console.warn('missing user profile')
      }
    }

    return {
      styles,
      headerClass,
      toComerDetail
    }
  },
  render() {
    return (
      <div class={this.headerClass} style={this.styles}>
        <div class="cursor-pointer mr-4" onClick={() => window.open(indexUrl, '_self')}>
          <ULogo height={40} theme="colorful" />
        </div>
        <div class="flex-1"></div>
        <UButton type="primary" size="small" class="h-8 w-22" onClick={this.toComerDetail}>
          <PlusFilled /> Connect
        </UButton>
      </div>
    )
  }
})

export default ProfileHeader
