import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useReducer, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Switch,
  FormControlLabel,
  Link,
  IconButton,
} from '@material-ui/core'

import PersonAddIcon from '@material-ui/icons/PersonAdd'

import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoFields, ErrorsField } from 'uniforms-material'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'
import { ServiceContext } from './context'
import SearchBox from '../../commons/search-box'
import Loading from '../../commons/loading'
import Avatar from '../../commons/avatar'
import moment from 'moment'
import CONSTANTS from '../../../../api/constants'
import numeral from 'numeral'

const StyledContactStep = styled.div`
  margin: 20px 0;

  .decision-marking-container {
    display: flex;
    flex-direction: row;
    align-items: center;

    .search-box {
      flex: 1;
      margin-right: 5px;
      input {
        padding: 10px 0;
      }
    }
    .refurbish-btn {
      margin-right: 5px;
    }
    .new-member-btn {
      padding: 6px;
      min-width: unset;
    }
  }

  .matches-container {
    margin-top: 20px;
    padding: 10px 20px;
    .list-item {
      &.selected {
        background-color: #e6e6e6;
      }
    }
  }
  .selected-member {
    margin-top: 20px;
    padding: 10px 20px;
    h3 {
      margin-bottom: 10px;
    }
    .name {
      font-weight: bold;
    }
  }

  .form-container {
    margin: 20px auto 10px;

    .form-title {
      font-weight: bold;
    }
  }
  .btns-container {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .history-item {
    margin-bottom: 10px;
    .item-date {
      font-weight: bold;
    }
    .item-data {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      .data {
        margin-right: 10px;
      }
    }
  }
`

const memberFormSchema = new SimpleSchema({
  name: String,
  mobile: { type: String, optional: true },
  email: { type: String, optional: true },
  address: { type: String, optional: true },
})
memberFormSchema.addDocValidator((obj) => {
  // console.log('doc validator', obj)
  if (!obj?.mobile && !obj?.email) {
    return [
      { name: 'mobile', type: 'required', value: 'Mobile or Email is required' },
      { name: 'email', type: 'required', value: 'Mobile or Email is required' },
    ]
  }
  return []
})

function contactStepReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setRefurbish':
      return {
        ...state,
        refurbish: payload,
        showNewMemberForm: payload ? false : state.showNewMemberForm,
      }
    case 'cancelForm':
      return {
        ...state,
        showNewMemberForm: false,
        selectedMember: null,
        memberData: {},
        updatedAt: new Date(),
      }
    case 'setShowNewMemberForm':
      return payload === true
        ? {
            ...state,
            showNewMemberForm: payload,
            refurbish: false,
          }
        : {
            name: '',
            mobile: '',
            email: '',
            address: '',
          }
    case 'setSearching':
      return { ...state, searching: payload }
    case 'setMembers':
      return {
        ...state,
        foundMembers: payload.members,
        keyword: payload.keyword,
        searching: false,
      }
    case 'selectMember':
      // console.log('selectMember', state.selectedMember, payload)
      return {
        ...state,
        selectedMember: payload,
        memberData: payload,
        updatedAt: new Date(),
      }
    case 'deselectMember':
      // console.log('deselectMember')
      return { ...state, selectedMember: null, memberData: {}, updatedAt: new Date() }

    case 'clear':
      // console.log('clear')
      return {
        ...state,
        foundMembers: [],
        selectedMember: null,
        // memberData: {},
        updatedAt: new Date(),
      }
    case 'setMemberData':
      return { ...state, memberData: payload, updatedAt: new Date() }
    case 'setHasValidData':
      return { ...state, hasValidData: payload, checkedAt: new Date() }
    default:
      return state
  }
}

function ContactStep() {
  const mounted = useRef(true)
  const searchBoxRef = useRef()

  useEffect(() => () => (mounted.current = false), [])

  const [state, dispatch] = useReducer(contactStepReducer, {
    updatedAt: null,
    hasValidData: false,
    checkedAt: null,
    refurbish: false,
    showNewMemberForm: false,
    searching: false,
    keyword: '',
    foundMembers: [],
    selectedMember: null,
    memberData: {},
  })

  const {
    setStepData,
    activeStep,
    goBack,
    goNext,
    setStepProperty,
    originalData,
  } = useContext(ServiceContext)
  const checkTimeout = useRef(null)
  const formRef = useRef()

  const {
    hasValidData,
    checkedAt,
    updatedAt,
    refurbish,
    showNewMemberForm,
    searching,
    keyword,
    foundMembers,
    selectedMember,
    memberData,
  } = state

  const checkData = async () => {
    console.log('checkData', memberData)
    const checkResult = await formRef.current?.validateModel(memberData)
    dispatch({ type: 'setHasValidData', payload: checkResult === null })
    return checkResult === null
  }

  useEffect(() => {
    if (originalData) {
      // console.log('originalData effect', originalData)
      if (originalData.memberId) {
        dispatch({
          type: 'selectMember',
          payload: {
            _id: originalData.memberId,
            name: originalData.name || '',
            mobile: originalData.phone || '',
            email: originalData.email || '',
            address: originalData.address || '',
          },
        })
        dispatch({ type: 'setHasValidData', payload: true })
      } else {
        dispatch({ type: 'setHasMember', payload: false })
      }
    }
  }, [originalData])

  useEffect(() => {
    if (activeStep !== 'contact' || !updatedAt) {
      return
    }
    // console.log('check data effect', memberData)
    Meteor.clearTimeout(checkTimeout.current)
    checkTimeout.current = Meteor.setTimeout(() => {
      checkData()
    }, 300)
  }, [updatedAt])

  useEffect(() => {
    // if (activeStep !== 'contact') {
    //   return
    // }
    // console.log('checkedAt effect')
    setStepData({
      stepKey: 'contact',
      data: {
        refurbish,
        selectedMember,
        memberData,
        updatedAt,
        hasValidData,
      },
    })
    setStepProperty({
      stepKey: 'contact',
      property: 'completed',
      value: hasValidData,
    })
  }, [checkedAt])

  const searchTimeout = useRef(null)
  const searchMember = (keyword) => {
    Meteor.clearTimeout(searchTimeout.current)
    searchTimeout.current = Meteor.setTimeout(() => {
      // only search when the keyword is long enough
      if (keyword.length < 1) {
        dispatch({ type: 'clear' })
        return
      }
      dispatch({ type: 'setSearching', payload: true })
      Meteor.call('members.search', { keyword }, (error, result) => {
        if (!mounted.current) {
          return
        }
        if (error) {
          showError(error.message)
          dispatch({ type: 'setSearching', payload: false })
          return
        }
        if (result) {
          dispatch({ type: 'setMembers', payload: { members: result.members, keyword } })
        }
      })
    }, 500)
  }

  const handleSubmit = () => {
    if (checkData()) {
      goNext()
    }
  }

  if (activeStep !== 'contact') {
    return null
  }

  const classes = ['contactstep-item-form']
  if (hasValidData === false) {
    classes.push('incomplete')
  }

  const renderFoundMembers = () => {
    if (refurbish || showNewMemberForm) {
      return null
    }
    if (selectedMember) {
      return null
    }
    if (keyword && foundMembers?.length === 0) {
      return (
        <ListItem>
          <ListItemText primary="No member was found with keyword" secondary="" />
        </ListItem>
      )
    }
    return foundMembers?.map((item) => {
      const isSelected = selectedMember && selectedMember._id === item._id
      return (
        <ListItem
          key={item._id}
          button
          onClick={() => {
            if (state.selectedMember?._id === item._id) {
              dispatch({ type: 'deselectMember' })
            } else {
              // searchBoxRef.current.clear()
              dispatch({ type: 'selectMember', payload: item })
            }
          }}
          className={`list-item ${isSelected ? 'selected' : ''}`}
        >
          <ListItemAvatar>
            <Avatar
              url={item.avatar}
              alt={item.name}
              linkUrl={`/profile/${item._id}`}
              size={45}
            />
          </ListItemAvatar>
          <ListItemText
            primary={item.name}
            secondary={`${item.mobile || ''}${item.email ? ` - ${item.email}` : ''}`}
          />
        </ListItem>
      )
    })
  }

  const renderMemberForm = () => {
    if (!showNewMemberForm && !selectedMember) {
      return null
    }

    return (
      <div className="form-container">
        <div className="form-title">
          {showNewMemberForm ? 'New member' : 'Selected member'}
        </div>
        <AutoForm
          ref={formRef}
          schema={new SimpleSchema2Bridge(memberFormSchema)}
          model={memberData}
          onSubmit={handleSubmit}
          onChange={(field, data) => {
            const newData = { ...memberData }
            newData[field] = data
            dispatch({ type: 'setMemberData', payload: newData })
          }}
        >
          <AutoFields />
          <ErrorsField />
          <div className="btns-container">
            <Button
              onClick={() => {
                dispatch({ type: 'cancelForm' })
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                formRef.current.submit()
              }}
              disabled={!hasValidData}
            >
              Submit
            </Button>
          </div>
        </AutoForm>
      </div>
    )
  }

  return (
    <StyledContactStep>
      <div className={classes.join(' ')}>
        <div className="decision-marking-container">
          <SearchBox
            ref={searchBoxRef}
            className="member-search-box"
            variant="outlined"
            defaultValue={memberData?.name}
            onChange={(value) => searchMember(value)}
            placeholder="search existing member"
            autoTrigger
            disabled={refurbish || showNewMemberForm}
          />
          <Button
            className="refurbish-btn"
            variant="contained"
            color={refurbish ? 'primary' : 'default'}
            onClick={() => {
              dispatch({ type: 'setRefurbish', payload: !refurbish })
            }}
            disabled={showNewMemberForm}
          >
            Refurbish
          </Button>
          <Button
            className="new-member-btn"
            variant="contained"
            color={showNewMemberForm ? 'primary' : 'default'}
            onClick={() => {
              dispatch({ type: 'setShowNewMemberForm', payload: true })
            }}
            disabled={refurbish}
          >
            <PersonAddIcon />
          </Button>
        </div>
        {renderFoundMembers()}
        {renderMemberForm()}
      </div>
    </StyledContactStep>
  )
}

ContactStep.propTypes = {
  initialData: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object),
  }),
}

ContactStep.defaultProps = {
  initialData: null,
}

export default ContactStep
