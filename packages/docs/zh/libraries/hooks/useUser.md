---
title: 用户信息
sidebar: true
---

```ts
import { useUser } from '@comunion/hooks'

defineComponent({
  setup(props, ctx) {
    const user = useUser()
    return () => <></>
  }
})
```
