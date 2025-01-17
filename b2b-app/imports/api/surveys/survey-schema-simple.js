import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import DatePicker from '/imports/ui/components/date-field'
// I would like to use a more modern looking date picker, but the
// lab@next has deprecated it. The newest version looks boring
//import { DatePicker } from '@material-ui/lab'
import GooglePlaces from '/imports/ui/components/google-places.js'
import ImageField from '/imports/ui/components/image-field'
import { cloneDeep } from 'lodash'

SimpleSchema.extendOptions(['uniforms'])
SimpleSchema.setDefaultMessages({
  messages: {
    en: {
      MustTick: 'You must agree to the terms and conditions',
    },
  },
})
const debug = require('debug')('app:survey-schema')

const checkVolume = function () {
  debug(`Checking ${this.key} ${this.value}`, this.definition)
  if (!this.value) return 'This is required'
  if (this.value?.match(this.definition.regEx)) return undefined
  this.validationContext.addValidationErrors([
    {
      name: this.key,
      type: 'notUnique',
    },
  ])
  return 'notUnique'
}

export const evaluate = (formData, context, condition) => {
  if (!Array.isArray(condition)) return true
  debug(`Evaluate ${condition?.join()}`, { formData, context })
  if (!condition) return true
  const [lhs, op = 'truthy', rhs] = condition
  const [section, field = lhs] = lhs.split(/[\/\.]/)
  const model =
    field !== lhs && formData && formData[section] ? formData[section] : context
  if (!model) return true

  // debug({ section, field, op, lhs, model })
  const value = model[field]
  if (['equal', 'eq', '='].includes(op)) return value === rhs
  if (['not equal', 'ne', '!='].includes(op)) return value !== rhs
  if (['falsy', '!'].includes(op)) return !value
  if (['contains', 'contain'].includes(op)) return value && value.includes(rhs)
  if (['truthy'].includes(op)) return !!value

  return false
}

const getOptionalFunc = (q, uniforms, optional) => {
  // If the question is conditional, create a function instead of the regular "optional" property
  if (q.condition && !optional) {
    uniforms.condition = q.condition
    return function () {
      // debug(
      //   `evaluating ${q.condition?.join()}`,
      //   this.obj,
      //   this.validationContext?._schema
      // )
      return !evaluate(
        this.obj,
        this.obj,
        this.validationContext?._schema[this.key].uniforms.condition
      )
    }
  }
  if (optional === undefined) return false // Return a value rather than 'undefined'
  return optional
}

/** 
   * The config will look like this
   *      answers: {
            combine: [
              { array: 'company.directors', field: 'directors-name' },
              { array: 'individual.individuals', field: 'individuals-name' },
              { array: 'trust.trustees', field: 'trustees-name' },
            ],
          },
   */
const getAnswers = (formData, q) => {
  if (Array.isArray(q.answers)) return q.answers
  debug({ answers: q.answers, formData })
  if (typeof q.answers === 'object') {
    if (q.answers.combine) {
      const list = q.answers.combine
        .map((selector) => {
          const [section, field = selector.array] = selector.array.split(/[\/\.]/)
          return (
            formData[section] &&
            formData[section][field] &&
            Array.isArray(formData[section][field]) &&
            formData[section][field]
              .map((row) => {
                return row[selector.field]
              })
              .filter(Boolean)
          )
        })
        .flat()
        .filter(Boolean)
        .map((name, ix) => {
          return { id: name.replace(/\W/g, '-').toLowerCase(), name }
        })
      debug('Computed answers', list)
      return list
    }
  }
  return []
}

const getSchemas = (survey, currentData) => {
  return (
    survey.steps
      // .filter((step) => {
      //   debug('Checking ', step, currentData, step.condition)
      //   return evaluate(currentData, { model: {} }, step.condition)
      // })
      .map((s, ix) => {
        const step = cloneDeep(s)
        step.schema = {}
        step.visible = true
        if (!evaluate(currentData, { model: {} }, step.condition)) step.visible = false
        else if (!step.questions)
          console.error(`Section ${ix} ${step.id} has no questions`)
        else {
          step.questions.forEach((q) => {
            step.schema[q.id] = {
              type: String,
              label: q.prompt,
              uniforms: {},
            }
            const qSchema = step.schema[q.id]
            const answers = getAnswers(currentData, q)
            switch (q.type) {
              case 'array':
                step.schema[q.id].type = Array
                step.schema[q.id].minCount = q.minCount || 1
                step.schema[q.id].label = ''
                const subSchema = {}
                answers.forEach((a) => {
                  const qaId = `${q.id}-${a.id}`
                  let optional = !!a.optional
                  const uniforms = {}
                  optional = getOptionalFunc(q, uniforms, optional)

                  subSchema[qaId] = {
                    type: String,
                    label: a.name,
                    optional,
                    uniforms,
                  }
                  if (a.re) {
                    subSchema[qaId].regEx = new RegExp(a.re)
                    subSchema[qaId].custom = checkVolume
                    // subSchema[qaId].optional = true
                  }
                  if (a.type === 'address') {
                    subSchema[qaId].uniforms.margin = 'normal'
                    subSchema[qaId].uniforms.component = GooglePlaces
                    subSchema[qaId].uniforms.autocompleteBugFix = true
                  }
                  if (a.type === 'date') {
                    subSchema[qaId].type = Date
                    subSchema[qaId].uniforms.margin = 'normal'
                    subSchema[qaId].uniforms.component = DatePicker
                  }

                  if (a.type === 'email')
                    subSchema[qaId].regEx = SimpleSchema.RegEx.EmailWithTLD
                  if (a.type === 'calculated') {
                    subSchema[qaId].optional = false
                    subSchema[qaId].uniforms.expression = a.expression
                  }
                })
                step.schema[`${q.id}.$`] = new SimpleSchema(subSchema)
                break
              case 'text':
                delete step.schema[q.id]
                answers.forEach((a) => {
                  const qaId = `${q.id}-${a.id}`
                  let optional = !!a.optional
                  const uniforms = {}
                  optional = getOptionalFunc(q, uniforms, optional)

                  step.schema[qaId] = {
                    type: String,
                    label: a.name,
                    optional,
                    uniforms,
                  }
                  if (a.re) {
                    step.schema[qaId].regEx = new RegExp(a.re)
                    step.schema[qaId].custom = checkVolume
                    // step.schema[qaId].optional = true
                  }
                  if (a.type === 'address') {
                    step.schema[qaId].uniforms.margin = 'normal'
                    step.schema[qaId].uniforms.component = GooglePlaces
                    step.schema[qaId].uniforms.autocompleteBugFix = true
                  }
                  if (a.type === 'date') {
                    step.schema[qaId].type = Date
                    step.schema[qaId].uniforms.margin = 'normal'
                    step.schema[qaId].uniforms.component = DatePicker
                  }

                  if (a.type === 'email')
                    step.schema[qaId].regEx = SimpleSchema.RegEx.EmailWithTLD
                  if (a.type === 'calculated') {
                    step.schema[qaId].optional = false
                    step.schema[qaId].uniforms.expression = a.expression
                  }
                })
                break
              case 'multiple':
                delete step.schema[q.id]
                answers.forEach((a) => {
                  const id = `${q.id}-${a.id}`
                  const uniforms = {}
                  const optional = getOptionalFunc(q, uniforms, true)
                  step.schema[id] = {
                    type: Boolean,
                    label: a.name,
                    optional, // Need a way to count these and set a minimum #required
                    uniforms,
                  }
                })
                answers
                  .filter((a) => a.specify)
                  .map((a) => {
                    const specifyId = `${q.id}-${a.id}-specify`
                    const uniforms = {}
                    const optional = getOptionalFunc(q, uniforms, !a.specifyRequired)
                    step.schema[specifyId] = {
                      type: String,
                      label: a.specify,
                      optional,
                      uniforms,
                    }
                    return specifyId
                  })
                // )
                break
              case 'single':
                qSchema.uniforms.checkboxes = 'true'
                qSchema.uniforms.options = answers.map((a) => {
                  return { label: a.name, value: a.value || a.id }
                })
                qSchema.optional = getOptionalFunc(q, qSchema.uniforms, qSchema.optional)
                // debug(`${q.id} optional`, qSchema.optional)

                answers
                  .filter((a) => a.specify)
                  .map((a) => {
                    const specifyId = `${q.id}-${a.id}-specify`
                    const uniforms = {}
                    const optional = getOptionalFunc(q, uniforms, !a.specifyRequired)
                    step.schema[specifyId] = {
                      type: String,
                      label: a.specify,
                      optional,
                      uniforms,
                    }
                    return specifyId
                  })
                // )
                break
              // case 'multiple':
              //   qSchema.uniforms.checkboxes = "true"
              //   qSchema.uniforms.options = answers.map((a) => {
              //     return { label: a.name, value: a.value || a.id }
              //   })
              //   qSchema.optional = getOptionalFunc(q, qSchema.uniforms, qSchema.optional)

              //   answers
              //     .filter((a) => a.specify)
              //     .map((a) => {
              //       const specifyId = `${q.id}-${a.id}-specify`
              //       const uniforms = {}
              //       const optional = getOptionalFunc(q, uniforms, !a.specifyRequired)
              //       step.schema[specifyId] = {
              //         type: Boolean,
              //         label: a.specify,
              //         optional,
              //         uniforms,
              //       }
              //       return specifyId
              //     })

              //   break
              case 'image':
                qSchema.uniforms.value = answers.map((a) => a.val)
                qSchema.uniforms.component = ImageField
                qSchema.optional = getOptionalFunc(q, qSchema.uniforms, qSchema.optional)

                answers
                  .filter((a) => a.specify)
                  .map((a) => {
                    const specifyId = `${q.id}-${a.id}-specify`
                    const uniforms = {}
                    const optional = getOptionalFunc(q, uniforms, !a.specifyRequired)
                    step.schema[specifyId] = {
                      type: String,
                      label: a.specify,
                      optional,
                      uniforms,
                    }
                    return specifyId
                  })
                break
                case 'upload':
                  qSchema.uniforms.value = answers.map((a) => a.val)
                  qSchema.uniforms.component = ImageField
                  qSchema.optional = getOptionalFunc(q, qSchema.uniforms, qSchema.optional)
  
                  answers
                    .filter((a) => a.specify)
                    .map((a) => {
                      const specifyId = `${q.id}-${a.id}-specify`
                      const uniforms = {}
                      const optional = getOptionalFunc(q, uniforms, !a.specifyRequired)
                      step.schema[specifyId] = {
                        type: String,
                        label: a.specify,
                        optional,
                        uniforms,
                      }
                      return specifyId
                    })
                  break
              // I don't know if we'll ever need this, just 'multi' instead
              // case 'boolean':
              //   qSchema.type = Boolean
              //   qSchema.uniforms.options = Array.isArray(answers) &&answers.map((a) => {
              //     return { label: a.name, value: a.value }
              //   })
              //   break
              case 'address':
                // delete step.schema[q.id]
                debug(`Rendering address field ${q.id}`)
                qSchema.uniforms.margin = 'normal'
                qSchema.uniforms.component = GooglePlaces
                qSchema.uniforms.component = true
                break
              case 'paragraph':
                delete step.schema[q.id]
                break
              case 'signature':
                // delete step.schema[q.id]
                break
              case 'upload':
                delete step.schema[q.id]
                break
              case 'date':
                delete step.schema[q.id]
                answers.forEach((a) => {
                  const id = `${q.id}-${a.id}`
                  step.schema[id] = {
                    type: Date,
                    label: a.name,
                    // This is NOT THE ONE YOU WANT !
                    // It's for an individual field, not a list
                    uniforms: { component: DatePicker },
                  }
                })
                break
              // Need a better way to handle this
              default:
                delete step.schema[q.id]
                q.prompt = `Unknown question type (${q.type}) for "${q.prompt}"`
                console.log(`Unsupported question type: [${q.type}]`)
                // Setting type to paragraph stops it trying to render a question
                q.type = 'paragraph'
              // q.type = 'paragraph'
            }
          })
        }
        debug('schema', step.schema)
        step.bridge = new SimpleSchema2Bridge(new SimpleSchema(step.schema))
        return step
      })
  )
}

export default getSchemas
