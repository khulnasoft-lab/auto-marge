import { createConditionConfig, createPullRequestInfo } from '../mock'

import blockingBaseBranches from '../../src/conditions/blockingBaseBranches'

const baseRef = {
  name: 'master',
  repository: {
    name: 'auto-merge',
    owner: {
      login: 'khulnasoft-labs'
    }
  },
  target: {
    oid: 'c00dbbc9dadfbe1e232e93a729dd4752fade0abf'
  }
}

describe('blockingBaseBranches', () => {
  it('returns success with no configuration', async () => {
    const result = blockingBaseBranches(
      createConditionConfig(),
      createPullRequestInfo({
        baseRef
      })
    )
    expect(result.status).toBe('success')
  })

  it('returns success with branch not in configuration', async () => {
    const result = blockingBaseBranches(
      createConditionConfig({
        blockingBaseBranches: ['develop']
      }),
      createPullRequestInfo({
        baseRef
      })
    )
    expect(result.status).toBe('success')
  })

  it('returns fail with branch in configuration', async () => {
    const result = blockingBaseBranches(
      createConditionConfig({
        blockingBaseBranches: ['master']
      }),
      createPullRequestInfo({
        baseRef
      })
    )
    expect(result.status).toBe('fail')
  })

  it('returns fail with regular expression matching branch in configuration', async () => {
    const result = blockingBaseBranches(
      createConditionConfig({
        blockingBaseBranches: [{ regex: /^mas.*/ }]
      }),
      createPullRequestInfo({
        baseRef
      })
    )
    expect(result.status).toBe('fail')
  })

  it('returns fail with branch, among others, in configuration', async () => {
    const result = blockingBaseBranches(
      createConditionConfig({
        blockingBaseBranches: ['master', 'develop', { regex: /^feature\/.+$/ }]
      }),
      createPullRequestInfo({
        baseRef
      })
    )
    expect(result.status).toBe('fail')
  })
})
