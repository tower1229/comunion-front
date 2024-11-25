import { MenuOption, UBreadcrumb, USpin, UButton } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import Dapp from './components/dapp'
import Finance from './components/finance'
import Governance from './components/governance'
import Info from './components/info'
import Menu from './components/menu'
import Security from './components/security'
import Sequence from './components/sequence'
import Social from './components/social'
import Team from './components/team'
import { BasicDialog } from '@/pages/bounty/components/Dialog'
import { useStartup } from '@/pages/project/hooks/useStartup'
import { getContactList } from '@/pages/project/util'

export default defineComponent({
  setup() {
    const currentEditComponent = ref<string>('INFO')
    const router = useRouter()
    const route = useRoute()

    const hasEditUnSave = ref(false)

    if (!route.params.id) {
      return null
    }
    const paramStartupId = Number(route.params.id)
    const startup = useStartup(paramStartupId)
    const loading = startup.loading
    const getDetail = () => {
      hasEditUnSave.value = false
      startup.reload()
    }
    // init
    getDetail()

    const socialList = computed(() => {
      const list = getContactList(startup.detail.value?.socials).filter(item => !!item.value)
      return list.length ? list : []
    })

    const nextRouter = ref()
    const nextMenuKey = ref<string | null>(null)
    const visibleConfirmDialog = ref(false)

    const handleMenuChange = (data: { key: string; item: MenuOption }) => {
      if (hasEditUnSave.value) {
        visibleConfirmDialog.value = true
        nextMenuKey.value = data.key
      } else {
        nextMenuKey.value = null
        if (nextRouter.value) {
          nextRouter.value = null
        }
        currentEditComponent.value = data.key
      }
    }

    const handleConfirm = () => {
      hasEditUnSave.value = false
      if (nextMenuKey.value) {
        currentEditComponent.value = nextMenuKey.value
      } else if (nextRouter.value) {
        router.push(nextRouter.value)
      }

      visibleConfirmDialog.value = false
    }

    const handleCancel = () => {
      visibleConfirmDialog.value = false
    }

    onBeforeRouteLeave(to => {
      if (hasEditUnSave.value) {
        visibleConfirmDialog.value = true
        nextRouter.value = to
        return false
      } else {
        return true
      }
    })

    return {
      loading,
      currentEditComponent,
      startup: startup.detail,
      route,
      socialList,
      getDetail,
      paramStartupId,
      hasEditUnSave,
      handleMenuChange,
      visibleConfirmDialog,
      handleConfirm,
      handleCancel
    }
  },
  render() {
    return (
      <USpin show={this.loading}>
        <UBreadcrumb class="mt-10 mb-10">
          {/* <UBreadcrumbItem>
            <span
              class="cursor-pointer flex text-primary items-center u-label2"
              onClick={() => {
                this.$router.go(-1)
              }}
            >
              <ArrowLeftOutlined />
              <span class="ml-1">BACK</span>
            </span>
          </UBreadcrumbItem> */}
        </UBreadcrumb>
        <div class="flex mb-20 gap-6">
          <div class="basis-1/4">
            <Menu value={this.currentEditComponent} onRouterChange={this.handleMenuChange} />
          </div>
          <div class="basis-3/4">
            {this.startup ? (
              <>
                {this.currentEditComponent === 'INFO' && (
                  <Info
                    data={{
                      logo: this.startup?.logo || '',
                      banner: this.startup?.banner || '',
                      name: this.startup?.name || '',
                      type: this.startup?.type || 0,
                      mission: this.startup?.mission || '',
                      overview: this.startup?.overview || '',
                      blockChainAddress: this.startup?.finance?.contract_address || '',
                      chain_id: this.startup?.chain_id,
                      tags: Array.isArray(this.startup?.tags)
                        ? this.startup!.tags.map(e => e.tag?.name || '--')
                        : [],
                      on_chain: this.startup?.on_chain
                    }}
                    startup_id={this.paramStartupId}
                    onEdit={() => (this.hasEditUnSave = true)}
                    onSaved={this.getDetail}
                  />
                )}
                {this.currentEditComponent === 'SECURITY' && (
                  <Security
                    data={{
                      kyc: this.startup?.kyc || '',
                      contract_audit: this.startup?.contract_audit || ''
                    }}
                    startup_id={this.paramStartupId}
                    onEdit={() => (this.hasEditUnSave = true)}
                    onSaved={this.getDetail}
                  />
                )}
                {this.currentEditComponent === 'FINANCE' && (
                  <Finance
                    data={this.startup?.finance}
                    startup_id={this.paramStartupId}
                    onEdit={() => (this.hasEditUnSave = true)}
                    onSaved={this.getDetail}
                  />
                )}
                {this.currentEditComponent === 'TEAM' && (
                  <Team startup_id={this.paramStartupId} founderId={this.startup?.comer_id} />
                )}
                {this.currentEditComponent === 'SOCIAL' && (
                  <Social
                    data={this.socialList}
                    startup_id={this.paramStartupId}
                    onEdit={() => (this.hasEditUnSave = true)}
                    onSaved={this.getDetail}
                  />
                )}
                {this.currentEditComponent === 'GOVERNANCE' && this.startup && (
                  <Governance
                    startup_id={this.paramStartupId}
                    startup={this.startup}
                    onEdit={() => (this.hasEditUnSave = true)}
                    onSaved={this.getDetail}
                  />
                )}
                {this.currentEditComponent === 'SEQUENCE' && (
                  <Sequence
                    data={{ tab_sequence: this.startup?.tab_sequence || '' }}
                    startup_id={this.paramStartupId}
                    onEdit={() => (this.hasEditUnSave = true)}
                    onSaved={this.getDetail}
                  />
                )}
                {this.currentEditComponent === 'DAPP' && <Dapp startup_id={this.paramStartupId} />}
              </>
            ) : null}
          </div>
        </div>
        {/* Discard the changes? */}
        <BasicDialog
          visible={this.visibleConfirmDialog}
          title="Discard the changes?"
          content="This can`t be undone and you will lose your changes."
          v-slots={{
            btns: () => (
              <div class="flex mt-10 justify-end">
                <UButton
                  type="default"
                  class="mr-16px w-164px"
                  size="small"
                  onClick={this.handleCancel}
                >
                  Cancel
                </UButton>
                <UButton type="primary" class="w-164px" size="small" onClick={this.handleConfirm}>
                  Yes
                </UButton>
              </div>
            )
          }}
        />
      </USpin>
    )
  }
})
