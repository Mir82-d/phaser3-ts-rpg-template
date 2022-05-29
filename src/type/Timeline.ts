import { Choice } from './Choice'

//write down DialogPlayer's event type.

//display dialog
type DialogEvent = {
    type: 'dialog',
    text: string,
    charName?: string
}

//choice event
type ChoiceEvent = {
    type : 'choice',
    choices: Choice[]
}

//timeline transition
type TimelineTransitionEvent = {
    type: 'timelineTransition',
    timelineID: string
}

//end event
type EndEvent = {
    type : 'end'
}

export type Timeline = (DialogEvent|ChoiceEvent|TimelineTransitionEvent|EndEvent)[]