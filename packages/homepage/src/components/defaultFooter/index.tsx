import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DefaultFooter',
  render() {
    const currentYear = new Date().getFullYear()
    return (
      <div class="bg-color-body mt-10 pt-4 pb-6 text-color2 ">
        <div class="u-page-container <lg:px-4">
          Powered by
          <a class="text-primary px-1 hover:opacity-80" href="//weconomy.network" target="_blank">
            WEconomy.network
          </a>
          ©{currentYear}
        </div>
      </div>
    )
  }
})
