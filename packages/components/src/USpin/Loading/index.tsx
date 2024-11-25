import { defineComponent } from 'vue'
import './style.css'

export default defineComponent({
  name: 'Loading',
  setup(props) {
    return {}
  },
  render() {
    return (
      <div class="customLoading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    )
  }
})
