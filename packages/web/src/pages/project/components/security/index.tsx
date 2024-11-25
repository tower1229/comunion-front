import { UCard } from '@comunion/components'
import { ArrowRightOutlined } from '@comunion/icons'
import { defineComponent, watch, ref } from 'vue'
export default defineComponent({
  props: {
    kyc: {
      type: String
    },
    contractAudit: {
      type: String
    }
  },
  setup(props) {
    const kycInfo = ref('')
    const auditInfo = ref('')
    watch(
      () => props.kyc,
      () => {
        kycInfo.value = props.kyc || ''
      },
      {
        immediate: true
      }
    )
    watch(
      () => props.contractAudit,
      () => {
        auditInfo.value = props.contractAudit || ''
      },
      {
        immediate: true
      }
    )

    return {
      kycInfo,
      auditInfo
    }
  },
  render() {
    return (
      <UCard title="Security" class="mb-6">
        {(this.kycInfo || this.auditInfo) && (
          <>
            {this.kycInfo && (
              <div class="mb-2">
                <a
                  href={this.kycInfo}
                  target="_blank"
                  class="flex text-color3 justify-end items-center hover:text-primary"
                >
                  <span class="flex-1 text-color1 uh5">KYC</span>
                  <p class="max-w-58  truncate u-h6">{this.kycInfo}</p>
                  <ArrowRightOutlined class="font-bold w-4" />
                </a>
              </div>
            )}
            {this.auditInfo && (
              <div class="mb-2">
                <a
                  href={this.auditInfo}
                  target="_blank"
                  class="flex text-color3 justify-end items-center hover:text-primary"
                >
                  <span class="flex-1 text-color1 uh5">AUDIT</span>
                  <p class="max-w-58 truncate u-h6">{this.auditInfo}</p>
                  <ArrowRightOutlined class="font-bold w-4" />
                </a>
              </div>
            )}
          </>
        )}
      </UCard>
    )
  }
})
