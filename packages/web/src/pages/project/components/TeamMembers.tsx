import { TeamOutlined, GroupFilled } from '@comunion/icons'
import { defineComponent } from 'vue'
import styles from './StartupCard.module.css'

const UTeamMembers = defineComponent({
  name: 'Proposal',
  props: {
    memberCount: {
      memberCount: Number,
      required: true
    },
    followCount: {
      memberCount: Number,
      required: true
    }
  },
  setup(props, ctx) {
    return () => (
      <div class={styles.team_members}>
        <div class="flex align-center">
          <span class={styles.members_svg}>
            <TeamOutlined class="text-primary m-0.5-0.5" />
          </span>
          <span class="u-body3 pl-2 pt-1">
            <i class={styles.members_span_i}>{props.memberCount}</i>
          </span>
          <span class="u-h5 m-auto ml-3">Members</span>
        </div>
        <div class="flex-1"></div>
        <div class="flex align-center ">
          <span class={styles.members_svg}>
            <GroupFilled class="text-primary m-2" />
          </span>
          <span class="u-body3 pl-2 pt-1">
            <i class={styles.members_span_i}>{props.followCount}</i>
          </span>
        </div>
      </div>
    )
  }
})

export default UTeamMembers
