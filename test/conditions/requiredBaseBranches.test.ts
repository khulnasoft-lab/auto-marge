import { createConditionConfig, createPullRequestInfo } from '../mock'

import requiredBaseBranches from '../../src/conditions/requiredBaseBranches'

const baseRef = {
  name: 'master',
  repository: {
    name: 'auto-merge',
    owner: {
      login: 'khulnasoft-lab'
    }
  },
  target: {
    oid: 'c00dbbc9dadfbe1e232e93a729dd4752fade0abf'
  }
}

describe('requiredBaseBranches', () => {
  it('returns success with no configuration', async () => {
    const result = requiredBaseBranches(
      createConditionConfig(),
      createPullRequestInfo({
        baseRef
      })
    )
    expect(result.status).toBe('success')
  })

  it('returns fail with branch not in configuration', async () => {
    const result = requiredBaseBranches(
      createConditionConfig({
        requiredBaseBranches: ['required-branch']
      }),
      createPullRequestInfo({
        baseRef
      })
    )
    expect(result.status).toBe('fail')
  })

  it('returns success with branch in configuration', async () => {
    const result = requiredBaseBranches(
      createConditionConfig({
        requiredBaseBranches: ['master']
      }),
      createPullRequestInfo({
        baseRef
      })
    )
    expect(result.status).toBe('success')
  })

  it('returns success with regular expression matching branch in configuration', async () => {
    const result = requiredBaseBranches(
      createConditionConfig({
        requiredBaseBranches: [{ regex: /^mas.+/ }]
      }),
      createPullRequestInfo({
        baseRef
      })
    )
    expect(result.status).toBe('success')
  })

  it('returns success with branch in pull request also in configuration', async () => {
    const result = requiredBaseBranches(
      createConditionConfig({
        requiredBaseBranches: ['master', 'develop', { regex: /^feature\/.+$/ }]
      }),
      createPullRequestInfo({
        baseRef
      })
    )
    expect(result.status).toBe('success')
  })
})
