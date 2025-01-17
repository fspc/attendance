import React from 'react'
import { TypeRegistry } from '/imports/ui/forms/survey-builder/components/types/type-registry'
import { useInitRecoil } from '../../hooks'
import { partsAtom, singleAtom } from '../../recoil/atoms'
import { Content } from './content'

export default {
  title: 'Survey Builder/Views/Edit/Content',
  component: Content,
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    },
  },
  decorators: [
    (Story) => {
      useInitRecoil(({ set }) => {
        const parts = [
          { _id: 'id1', config: TypeRegistry.get('single') },
          { _id: 'id2', config: TypeRegistry.get('single') },
          { _id: 'id3', config: TypeRegistry.get('single') },
        ]
        set(partsAtom, parts)
        parts.forEach(({ _id }, i) =>
          set(singleAtom(_id), {
            prompt: `Question ${i}`,
          })
        )
      })
      return <Story />
    },
  ],
}

const Template = (args) => <Content {...args} />

export const Default = Template.bind({})
