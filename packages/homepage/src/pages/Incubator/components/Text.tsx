import { defineComponent } from 'vue'

export const Text = defineComponent({
  name: 'Text',
  setup() {
    return () => (
      <div class="text-base leading-normal text-[#666] z-1 relative">
        A community-driven, permissionless and decentralized incubator network of blockchain native,
        aims to educate, invest and incubate into early-stage Dapps to promote the blockchain
        economy in the world for realizing the vision of WEconomy.
      </div>
    )
  }
})
export default Text
