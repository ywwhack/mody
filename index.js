import request from './request'

const DEFAULT_CONFIG = {
  isEmptyData (data) {
    // undefined, null, empty object && empty array will be true
    return !data
      || Object.keys(data).length === 0
      || (Array.isArray(data) && data.length === 0)
  }
}

let has_mody_config = false
let modyConfig = DEFAULT_CONFIG

// if user has mody.config.js, use it
// otherwise, use default config
try {
  modyConfig = Object.assign({}, modyConfig, require('./mody.config.js'))
  has_mody_config = true
} catch (e) {
  has_mody_config = false
}

export default function mody({ identifier, data }) {
  return new Promise(resolve => {
    // if in production mode, return data directly
    if (process.env.NODE_ENV === 'production') return data

    // get isEmptyData function according to identifier
    const { rules } = modyConfig
    const isEmptyData = rules && rules[identifier] || modyConfig.isEmptyData

    if (isEmptyData(data)) {
      // if data is empty, return mock data
      return request.get(identifier)
    } else {
      request.post({ identifier, data })
      return data
    }
  })
}
