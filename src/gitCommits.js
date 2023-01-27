import dargs from 'dargs'
import execa from 'execa'
import _ from 'lodash'

const commitDelimiter = '--------->commit---------'

const hashDelimiter = '--------->hash---------'

const format = `%H${hashDelimiter}%B%n${commitDelimiter}`

const buildGitArgs = (gitOpts) => {
  const { from, to, ...otherOpts } = gitOpts
  const formatArg = `--format=${format}`
  const fromToArg = [from, to].filter(Boolean).join('..')

  const gitArgs = ['log', formatArg, fromToArg]

  return gitArgs.concat(
    dargs(gitOpts, {
      includes: Object.keys(otherOpts),
    }),
  )
}

const gitCommits = async (gitOpts) => {
  const args = buildGitArgs(gitOpts)


  console.log(`git ${_.join(args, ',')}`);

  const { stdout } = await execa('git', args, {
    cwd: process.cwd(),
  })

  const commits = stdout.split(`${commitDelimiter}\n`).map((messageItem) => {
    const [hash, message] = messageItem.split(hashDelimiter)

    return {
      hash,
      message: message.replace(commitDelimiter, ''),
    }
  })

  return commits
}

export default gitCommits
