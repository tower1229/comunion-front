import { UBreadcrumb, UBreadcrumbItem } from '@comunion/components'
import { ArrowLeftOutlined } from '@comunion/icons'
import { computed, defineComponent } from 'vue'
import { RouteRecordName, useRoute, useRouter } from 'vue-router'

const Breadcrumb = defineComponent({
  name: 'Breadcrumb',
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()

    const breadcrumbData = computed(() => {
      const result: { path: string; name: RouteRecordName | undefined }[] = [
        {
          path: '/builder',
          name: 'my dashboard'
        }
      ]
      const r = route.matched.find(r => r.name && r.path)

      if (r) {
        if (r.name == 'basicSetting') {
          r.name = 'basic setting'
        }
        if (r.name == 'financeSetting') {
          r.name = 'finance setting'
        }
        result.push({
          name: r.name === 'basicSetting' ? 'basic setting' : r.name,
          path: r.path
        })
      }
      return result
    })

    const onLinkClick = (path: string) => {
      router.push(path)
    }

    const slots = {
      separator: () => <ArrowLeftOutlined />
    }

    return () => (
      <>
        <div class="mt-15 mb-10">
          <UBreadcrumb class="flex items-center">
            <UBreadcrumbItem v-slots={slots}></UBreadcrumbItem>
            {breadcrumbData.value.map((item, index) => (
              <UBreadcrumbItem key={item.path} v-slots={slots}>
                {index == breadcrumbData.value.length - 1 ? (
                  <span class="text-primary uppercase u-label1">{item.name}</span>
                ) : (
                  <span
                    class="text-primary uppercase u-label1"
                    onClick={() => onLinkClick(item.path)}
                  >
                    {item.name}
                  </span>
                )}
              </UBreadcrumbItem>
            ))}
          </UBreadcrumb>
        </div>
      </>
    )
  }
})

export default Breadcrumb
