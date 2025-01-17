import React, { useState } from 'react'
import { HotKeys } from 'react-hotkeys'
import { useHistory } from 'react-router-dom'
import SplitPane from 'react-split-pane'
import { Builder } from '../survey-builder/builder'
import { DoubleLayout } from './double-layout'
import { EditorPanel } from './editor-panel'
import { EditorToolbar } from './editor-toolbar'
import { PreviewPanel } from './preview-panel'
import { SingleLayout } from './single-layout'
import { parse } from '/imports/api/forms/engine.js'
import map2Uniforms from '/imports/api/surveys/uniforms'
import map2UiSchema from '/imports/api/surveys/ui-schema'
import { partsAtom } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { useRecoilCallback } from 'recoil'
import { RecoilRoot } from 'recoil'
import { makeId } from '../survey-builder/utils'

const debug = require('debug')('app:forms:framework')

export const EditorContext = React.createContext()

const Framework = ({ id, item, methods }) => {
  const keyMap = {
    save: ['command+s', 'Control+s'],
  }

  const handlers = {
    save: (event) => {
      event.preventDefault()
      save(false)
    },
  }

  const save = (quit, autosave = false) => {
    try {
      methods.update(
        id,
        {
          _id: id,
          source: formEditorInput,
          json: JSON.parse(jsonEditorInput),
          survey: raw,
          autosave,
        },
        quit
      )
    } catch (e) {
      debug(`Update error ${e.message}`)
    }
  }

  const { goBack } = useHistory()
  const back = () => {
    goBack()
  }
  // State of the form editor, exposed in the EditorContext
  const [formEditorInput, setFormEditorInput] = React.useState(item.source)

  const [jsonEditorInput, setJsonEditorInput] = React.useState(
    JSON.stringify(item.json, null, 2),
    null,
    2
  )

  const [raw, setRaw] = React.useState({})

  const [errors, setErrors] = React.useState(parse(formEditorInput).errs)
  const [autoRun, setAutoRun] = React.useState(
    localStorage.getItem('formEditorAutoRun') === 'true' ? true : false
  )
  const [autoSave, setAutoSave] = React.useState(
    localStorage.getItem('formEditorAutoSave') === 'false' ? false : true
  )
  //codemirror references
  const [editor, setEditor] = React.useState()
  const [doc, setDoc] = React.useState()
  //error widgets
  const [widgets, setWidgets] = React.useState([])
  const [tab, setTab] = React.useState(
    isNaN(parseInt(localStorage.getItem('formEditorTab')))
      ? 0
      : parseInt(localStorage.getItem('formEditorTab'))
  )

  const [layout, setLayout] = React.useState(
    localStorage.getItem('formEditorLayout')
      ? localStorage.getItem('formEditorLayout')
      : 'single'
  )

  const currentFolds = { form: {}, json: {} }
  const [folds, setFolds] = React.useState(
    localStorage.getItem('folds')
      ? JSON.parse(localStorage.getItem('folds'))
      : currentFolds
  )

  const updateFold = (line, isFold, editorType) => {
    currentFolds[editorType][line] = isFold
    // console.log('updated fold', currentFolds)
    saveFolds()
  }

  const saveFolds = () => {
    // console.log('saved folds', currentFolds)
    const updated = {
      json: { ...folds.json, ...currentFolds.json },
      form: { ...folds.form, ...currentFolds.form },
    }
    // console.log(updated)
    setFolds(updated)
    localStorage.setItem('folds', JSON.stringify(updated))
  }

  const changeLayout = (newLayout) => {
    const layouts = ['single', 'double', 'dnd']

    if (layouts.includes(newLayout)) {
      localStorage.setItem('formEditorLayout', newLayout)
      setLayout(newLayout)
    }
  }

  // Function to update state of editor input, i.e. stores input form syntax
  const updateFormInput = (input) => {
    setFormEditorInput(input)
  }

  //tool-bar toggle to view/edit dnd form
  const [checked, setChecked] = useState(false)

  const getSource = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const parts = snapshot.getLoadable(partsAtom).contents
        const sourceJSON = parts.map(({ _id: pid, config }) => ({
          ...snapshot.getLoadable(config.atom(pid)).contents,
          type: config.component.name.toLowerCase(),
        }))
        return sourceJSON
      },
    []
  )

  const compileForm = () => {
    if (layout === 'dnd') {
      const sourceJSON = getSource()
      const sections = sourceJSON.reduce((acc, curr, index) => {
        //if first one is not a section => create a  default section
        if (index === 0 && curr.type !== 'section')
          return [{ id: makeId(), name: 'Section 1', questions: [{ ...curr }] }]
        //if type is section, then create an object
        if (curr.type === 'section') return [...acc, { ...curr, questions: [] }]
        //put the question inside the last section we created
        acc[acc.length - 1].questions = [...acc[acc.length - 1].questions, curr]
        return acc
      }, [])

      let survey = {
        sections,
        name: 'Sample Survey',
        slug: 'sample',
        version: '1',
        active: true,
      }

      const specific = map2Uniforms(survey)
      setRaw(specific)

      setJsonEditorInput(JSON.stringify(survey, null, 2))
    } else {
      const result = parse(formEditorInput)
      if (result.status === 'success') {
        const specific = map2Uniforms(result.survey)
        debug({ specific })
        setRaw(specific)

        setJsonEditorInput(JSON.stringify(result.survey, null, 2))
        console.log('JSON result', result)
        setErrors(result.errs)
        showErrors(result.errs)
      } else {
        setJsonEditorInput(JSON.stringify(result.survey, null, 2))
        setErrors(result.errs)
        showErrors(result.errs)
      }
    }
  }

  // Function to update state of editor input, i.e. stores input form syntax
  const updateJsonInput = (input) => {
    setJsonEditorInput(input)

    // parse input here?
  }

  const toggleAutoRun = () => {
    const toggledTo = autoRun ? false : true
    setAutoRun(toggledTo)
    localStorage.setItem('formEditorAutoRun', toggledTo)
  }

  const toggleAutoSave = () => {
    const toggledTo = autoSave ? false : true
    setAutoSave(toggledTo)
    localStorage.setItem('formEditorAutoSave', toggledTo)
  }

  const changeTab = (i) => {
    setTab(i)
    localStorage.setItem('formEditorTab', i)
  }
  const showErrors = (errors) => {
    hideErrors()
    setWidgets([])

    if (errors === 'No Errors' || !errors) return

    const newWidgets = []

    for (let i = 0; i < errors.length; i++) {
      const error = errors[i]
      const msg = document.createElement('div')
      const icon = msg.appendChild(document.createElement('span'))
      icon.innerHTML = '!!'
      icon.className = 'lint-error-icon'
      msg.appendChild(document.createTextNode(error.error))
      msg.className = 'lint-error'
      newWidgets.push(doc.addLineWidget(error.lineno - 1, msg))
    }
    setWidgets(newWidgets)
  }

  const hideErrors = () => {
    for (var i = 0; i < widgets.length; ++i) editor.removeLineWidget(widgets[i])
  }

  // display errors on load
  React.useEffect(() => {
    if (editor) {
      showErrors(errors)
    }
  }, [editor])

  let layoutComponent = <SingleLayout />

  switch (layout) {
    case 'single':
      layoutComponent = <SingleLayout />
      break
    case 'double':
      layoutComponent = <DoubleLayout />
      break
    case 'dnd':
      layoutComponent = <Builder />
      break
    default:
      layoutComponent = <SingleLayout />
      break
  }

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <EditorContext.Provider
        value={{
          editors: [
            {
              name: 'form',
              editorValue: formEditorInput,
              updateEditor: updateFormInput,
              editorType: 'form',
            },
            {
              name: 'json',
              editorValue: jsonEditorInput,
              updateEditor: updateJsonInput,
              editorType: { name: 'javascript', json: true },
            },
          ],
          errors: errors ? errors : 'No Errors',
          save,
          setRaw,
          autoRun,
          toggleAutoRun,
          autoSave,
          toggleAutoSave,
          compileForm,
          setChecked,
          checked,
          editor,
          doc,
          setEditorDoc: (editor) => {
            setEditor(editor)
            setDoc(editor.getDoc())
          },
          hideErrors,
          showErrors,
          tab,
          changeTab,
          layout,
          changeLayout,
          name: item.name,
          slug: item.slug,
          folds,
          updateFold,
        }}
      >
        <EditorToolbar />
        {layoutComponent}
      </EditorContext.Provider>
    </HotKeys>
  )
}

export default Framework
