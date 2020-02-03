import { useState, useEffect } from 'react'

// Since these are defined outside of the useStore hook every component can share and use all of the data from all the components.
// This allows us to manage state globally.
let globalState = {}
let listeners = []
let actions = {}

export const useStore = (shouldListen = true) => {
  const setState = useState(globalState)[1]; //the [1] here means the second value in teh array useState gives us, which is the set function setState.

  const dispatch = (actionIdentifier, payload) => {
    const newState = actions[actionIdentifier](globalState, payload)
    globalState = { ...globalState, ...newState }

    for(const listener of listeners) {
      listener(globalState)
    }
  }

  useEffect(() => {
    if(shouldListen) {
      listeners.push(setState)
    }

    return () => {
      if(shouldListen) {
        listeners = listeners.filter(li => li !== setState)
      }
    }
  }, [setState, shouldListen])

  return [ globalState, dispatch ]
}

export const initStore = (userActions, initialState) => {
  if(initialState) {
    globalState = { ...globalState, ...initialState }
  }
  actions = { ...actions, ...userActions }
}