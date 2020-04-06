import React from 'react'
import { Label, Icon, Input } from 'semantic-ui-react'

export default Tag = ({ index, tag, adjustPrice, newTagName, removeTag }) => {
  const [disableToggle, setDisableToggle] = React.useState(false)

  return (
    <>
      <Label id="item-pill" key={index} style={{ margin: '5px' }} size="big" color="blue">
        {!disableToggle ? (
          <span
            onClick={() => {
              setDisableToggle(!disableToggle)
            }}
          >
            {tag.name}
          </span>
        ) : (
          <Input
            size="mini"
            defaultValue={tag.name}
            onBlur={() => setDisableToggle(!disableToggle)}
            onChange={e => newTagName(tag._id, e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                setDisableToggle(!disableToggle)
              }
            }}
          />
        )}

        {!disableToggle ? (
          <Label.Detail
            onClick={() => {
              setDisableToggle(!disableToggle)
            }}
            className="item-name"
            key={'b'}
          >
            ${tag.price}
          </Label.Detail>
        ) : (
          <>
            &nbsp;$
            <Input
              type="number"
              id="pill-price-input"
              size="mini"
              style={{ width: `70px`, height: '35px' }}
              defaultValue={tag.price}
              onChange={e => adjustPrice(tag._id, e.target.value)}
              onBlur={() => setDisableToggle(!disableToggle)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  setDisableToggle(!disableToggle)
                }
              }}
            />
          </>
        )}
        <Icon id="delete-pill" name="delete" onClick={() => removeTag(tag, index)} />
      </Label>
    </>
  )
}
