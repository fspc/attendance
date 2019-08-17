//
// Back2bikes schema overrides
//
const b2bSchema = {
  aboutStep: {
    schema: {
      type: 'object',
      title: 'Lets get to know each other.',
      // required: ["bikesHousehold", "reasons"],
      properties: {
        bikesHousehold: {
          type: 'number',
          title: 'How many bikes in your household?'
        },
        primaryBike: {
          type: 'string',
          title: 'What type of bike do you ride the most?',
          enum: ['Road/racer', 'Hybrid', 'Mountain', 'Cruiser', 'Ladies', 'Gents', 'Fixie/Single Speed']
        },
        workStatus: {
          type: 'string',
          title: 'Work status',
          enum: ['Full Time', 'Part Time', 'Pension/Disability', 'Unemployed', 'Student', 'Retired']
        },
        reasons: { type: 'string', title: 'Reasons for volunteering' }
      }
    },
    uiSchema: {
      bikesHousehold: {
        'ui:widget': 'updown',
        'ui:placeholder': 'Enter the number of bikes you own',
        'ui:autofocus': true
      },
      primaryBike: {
        'ui:widget': 'select',
        'ui:placeholder': 'Select a type of bike'
      },
      workStatus: {
        'ui:widget': 'select',
        'ui:placeholder': 'Select your employment status'
      },
      reasons: {
        'ui:widget': 'textarea',
        'ui:placeholder':
          'Some good starting points:\nWhat makes you want to to volunteer at Back2Bikes?\nHave you ever done any other volunteering before?\nHave you worked on bikes or something similar before?',
        'ui:options': {
          rows: 12
        }
      }
    }
  }
}
//
// Peak Adventure schema overrides
//
const paSchema = {
  aboutStep: {
    schema: {
      type: 'object',
      required: [],
      properties: {
        sports: {
          type: 'array',
          title: 'Which of these sports are you active in?',
          uniqueItems: true,
          items: {
            type: 'string',
            enum: ['Kayaking', 'Road cycling', 'MTB', 'Running', 'Swimming', 'Triathlon', 'Multisport']
          }
        },
        reasons: {
          type: 'string',
          title: 'Tell us why you come to Peak Adventure sessions?'
        }
      }
    },
    uiSchema: {
      sports: {
        'ui:widget': 'checkboxes'
      },
      reasons: {
        'ui:widget': 'textarea',
        'ui:placeholder': '',
        'ui:options': {
          rows: 12
        }
      }
    }
  },
  termsStep: {
    schema: {
      type: 'object',
      required: ['swim', 'terms', 'fitness'],
      properties: {
        swim: {
          description: 'You must tick all of these',
          type: 'boolean',
          enum: [true],
          title: 'I can swim 200 metres unassisted'
        },
        terms: {
          type: 'boolean',
          enum: [true],
          title: 'I have read and agree to the Terms & Conditions'
        },
        fitness: {
          type: 'boolean',
          enum: [true],
          title: 'I declare I am medically fit and capable of undertaking this physical activity'
        }
      }
    },
    uiSchema: {}
  }
}

//
// Bicycles for Humanity (B4H) schema overrides
//
const b4hSchema = {
  aboutStep: {
    schema: {
      type: 'object',
      required: [],
      properties: {
        reasons: {
          type: 'string',
          title: 'Tell us why you volunteer for Bicycles For Humanity?'
        }
      }
    },
    uiSchema: {
      reasons: {
        'ui:widget': 'textarea',
        'ui:placeholder': '',
        'ui:options': {
          rows: 12
        }
      }
    }
  },
  termsStep: {
    schema: {
      type: 'object',
      required: ['permission', 'terms', 'privacy'],
      properties: {
        wwcc: {
          type: 'string',
          title:
            'Please enter your Working With Children Check (WWCC) number (if you have one). 8 digits, no need for the -01 or -02 at the end.'
        },
        permission: {
          description: 'You must tick all of these',
          type: 'boolean',
          enum: [true],
          title:
            'I consent to Bicycles for Humanity Melbourne to take, use and distribute photographs and video in order to promote volunteering or the organisation'
        },
        privacy: {
          type: 'boolean',
          enum: [true],
          title:
            'I consent to Bicycles for Humanity Melbourne storing the information I have provided above. I understand that Bicycles for Humanity Melbourne will not disclose the above information without my express consent other than for reasons related to my engagement as a volunteer.'
        },
        terms: {
          type: 'boolean',
          enum: [true],
          title: 'I have read and agree with the Terms & Conditions in the Bicycles For Humanity Volunteer Handbook'
        }
      }
    },
    uiSchema: {}
  }
}

const customSchemas = {
  b2b: b2bSchema,
  pa: paSchema,
  b4h: b4hSchema
}

const defaultSchema = [
  {
    stepTitle: 'About You',
    stepDescription: 'About',
    schema: {
      type: 'object',
      title: 'Lets get to know each other.',
      // required: ["bikesHousehold", "reasons"],
      properties: {
        bikesHousehold: {
          type: 'number',
          title: 'How many bikes in your household?'
        },
        primaryBike: {
          type: 'string',
          title: 'What type of bike do you ride the most?',
          enum: ['Road/racer', 'Hybrid', 'Mountain', 'Cruiser', 'Ladies', 'Gents', 'Fixie/Single Speed']
        },
        workStatus: {
          type: 'string',
          title: 'Work status',
          enum: ['Full Time', 'Part Time', 'Pension/Disability', 'Unemployed', 'Student', 'Retired']
        },
        reasons: { type: 'string', title: 'Reasons for volunteering' }
      }
    },
    uiSchema: {
      bikesHousehold: {
        'ui:widget': 'updown',
        'ui:placeholder': 'Enter the number of bikes you own',
        'ui:autofocus': true
      },
      primaryBike: {
        'ui:widget': 'select',
        'ui:placeholder': 'Select a type of bike'
      },
      workStatus: {
        'ui:widget': 'select',
        'ui:placeholder': 'Select your employment status'
      },
      reasons: {
        'ui:widget': 'textarea',
        'ui:placeholder':
          'Some good starting points:\nWhat makes you want to to volunteer at Back2Bikes?\nHave you ever done any other volunteering before?\nHave you worked on bikes or something similar before?',
        'ui:options': {
          rows: 12
        }
      }
    }
  },
  {
    stepTitle: 'Contact',
    stepDescription: 'Contact',
    schema: {
      title: 'Details',
      type: 'object',
      required: ['name', 'pin'],
      properties: {
        name: { type: 'string', title: 'Name' },
        email: { type: 'string', format: 'email', title: 'Email' },
        addressStreet: { type: 'string', title: 'Street Address' },
        addressSuburb: { type: 'string', title: 'Suburb' },
        addressState: {
          type: 'string',
          title: 'State',
          default: 'VIC',
          enum: ['VIC', 'NSW', 'SA', 'QLD', 'NT', 'WA', 'TAS']
        },
        addressPostcode: { type: 'string', title: 'Postcode' },
        phone: { type: 'string', title: 'Phone number' },
        mobile: { type: 'string', title: 'Mobile number' },
        pin: { type: 'string', title: 'PIN number', maxLength: 4 },
        pinConfirm: { type: 'string', title: 'PIN number', maxLength: 4 }
      }
    },
    uiSchema: {
      name: {
        'ui:placeholder': 'Enter your name',
        'ui:autofocus': true
      },

      email: {
        'ui:placeholder': 'Enter your email address'
      },
      addressStreet: {
        'ui:placeholder': 'Enter your street address e.g. 12 Luck Street'
      },
      addressSuburb: {
        'ui:placeholder': 'Enter your suburb'
      },
      addressState: {
        'ui:placeholder': 'Enter your state'
      },
      addressPostcode: {
        'ui:placeholder': 'Enter your postcode'
      },
      phone: {
        'ui:placeholder': 'Enter your phone number',
        'ui:options': {
          inputType: 'tel'
        }
      },
      mobile: {
        'ui:placeholder': 'Enter your mobile number',
        'ui:options': {
          inputType: 'tel'
        }
      },
      pin: {
        'ui:placeholder': 'Enter a PIN number for signing in and out.',
        'ui:options': {
          inputType: 'tel'
        }
      },
      pinConfirm: {
        'ui:placeholder': 'Enter the same PIN number again to confirm.',
        'ui:options': {
          inputType: 'tel'
        }
      }
    }
  },
  {
    stepTitle: 'Emergency',
    stepDescription: 'Emerg',
    schema: {
      type: 'object',
      title: 'Who should we contact in an emergency?',
      required: ['emergencyContact', 'emergencyPhone'],
      properties: {
        emergencyContact: { type: 'string', title: 'Emergency Contact Name' },
        emergencyEmail: { type: 'string', title: 'Emergency Contact Email' },
        emergencyPhone: {
          type: 'string',
          title: 'Emergency Contact Mobile number'
        }
      }
    },
    uiSchema: {
      emergencyContact: {
        'ui:placeholder': "Enter your emergency contact's full name",
        'ui:autofocus': true
      },
      emergencyEmail: {
        'ui:placeholder': "Enter your emergency contact's email"
      },
      emergencyPhone: {
        'ui:placeholder': "Enter your emergency contact's mobile or phone number",
        'ui:options': {
          inputType: 'tel'
        }
      }
    }
  },
  {
    stepTitle: 'Avatar',
    stepDescription: 'Avatar',
    schema: {
      type: 'object',
      title: 'Choose an avatar',
      // required: ["emergencyContact"],
      properties: {
        avatar: {
          type: 'string',
          title: 'Avatar',
          default: 'default.jpg',
          enum: [
            'default.jpg',
            '1.jpg',
            '2.jpg',
            '3.jpg',
            '4.jpg',
            '5.jpg',
            '6.jpg',
            '7.jpg',
            '8.jpg',
            '9.jpg',
            '10.jpg',
            '11.jpg',
            '12.jpg',
            '13.jpg',
            '14.jpg',
            '15.jpg',
            '16.jpg',
            'test11.png',
            'test14.png',
            'test16.png',
            'test17.png',
            'test18.png',
            'test19.png',
            'test20.png',
            'test21.png',
            'test24.png',
            'test25.png',
            'test26.png',
            'test28.png',
            'test29.png'
          ],
          enumNames: [
            'default',
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven',
            'eight',
            'nine',
            'ten',
            'eleven',
            'twelve',
            'thirteen',
            'fourteen',
            'fifteen',
            'sixteen',
            't11',
            't12',
            't13',
            't14',
            't15',
            't16',
            't17',
            't18',
            't19',
            't20',
            't21',
            't22',
            't23',
            't24',
            't25',
            't26',
            't27'
          ]
        }
      }
    },
    uiSchema: {
      avatar: {
        'ui:widget': 'avatarWidget',
        'ui:options': {
          label: false
        }
      }
    }
  },
  {
    stepTitle: 'Terms',
    stepDescription: 'Terms',
    schema: {
      type: 'object',
      title: 'Terms and Conditions',
      required: ['privacy'],
      properties: {
        privacy: {
          type: 'boolean',
          enum: [true],
          title:
            'I consent to Back2bikes storing the information I have provided above. I understand that Back2bikes will not disclose the above information without my express consent other than for reasons related to my engagement as a volunteer.'
        }
      }
    },
    uiSchema: {
      avatar: {
        'ui:widget': 'avatarWidget',
        'ui:options': {
          label: false
        }
      }
    }
  }
]

//
// Copy in the schema overrides
//
const custom = 'b2b' // Meteor.settings.public.recruit || "b2b"
if (custom && customSchemas[custom]) {
  const newSchema = customSchemas[custom]
  const steps = ['about', 'contact', 'emergency', 'avatar', 'terms']
  steps.forEach((step, ix) => {
    const stepName = `${step}Step`
    if (newSchema[stepName] && newSchema[stepName].schema) {
      defaultSchema[ix].schema = newSchema[stepName].schema
      defaultSchema[ix].uiSchema = newSchema[stepName].uiSchema
    }
  })
}

// export default defaultSchema

const getSchemas = custom => {
  if (custom && customSchemas[custom]) {
    const newSchema = customSchemas[custom]
    const steps = ['about', 'contact', 'emergency', 'avatar', 'terms']
    steps.forEach((step, ix) => {
      const stepName = `${step}Step`
      if (newSchema[stepName] && newSchema[stepName].schema) {
        defaultSchema[ix].schema = newSchema[stepName].schema
        defaultSchema[ix].uiSchema = newSchema[stepName].uiSchema
      }
    })
  }
  return defaultSchema
}

export default getSchemas
