import { Plugin } from '@remixproject/engine'
import { CreateChatCompletionResponse } from 'openai'

const _paq = (window._paq = window._paq || [])

const profile = {
  name: 'openaigpt',
  displayName: 'openaigpt',
  description: 'openaigpt',
  methods: ['message'],
  events: [],
  maintainedBy: 'Remix',
}

export class OpenAIGpt extends Plugin {
  constructor() {
    super(profile)
  }

  async message(prompt): Promise<CreateChatCompletionResponse> {
    this.call('layout', 'maximizeTerminal')
    this.call('terminal', 'log', 'Waiting for GPT answer...')
    let result
    try {
      result = await (
        await fetch('https://openai-gpt.remixproject.org', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        })
      ).json()
    } catch (e) {
      this.call('terminal', 'log', { type: 'typewritererror', value: `Unable to get a response ${e.message}` })
      return
    }
    
    if (result && result.choices && result.choices.length) {
      this.call('terminal', 'log', { type: 'typewritersuccess', value: result.choices[0].message.content })    
    } else {
      this.call('terminal', 'log', { type: 'typewritersuccess', value: 'No response...' })
    }
    return result.data
  }
}
