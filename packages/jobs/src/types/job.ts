import {Job as AgendaJob} from 'agenda'

export interface JobDefinition {
  /**
   * The type of the job.
   * "recurrent": The job will be executed every X time.
   * "single": The job will be executed on demand.
   */
  type: 'recurrent' | 'single'

  run: RunFunction

  /**
   * A function that returns the date when the job should be executed.
   */
  getNextRun?: () => Date

  /**
   * If number, number of milliseconds between each time the job gets ran.
   * If string, it can be a human-readable format string (e.g. "5 minutes"), or a cron format string (e.g. "0 0/5 * * * *").
   */
  runEvery?: number | string

  /**
   * Wether to save results in the db or not. Defaults to false.
   */
  persistResult?: boolean

  /**
   * The max numbers an single-type job will be retried on failure. Defaults to 0.
   */
  maxRetries?: number

  /**
   * Maximum number of that job that can be running at once.
   */
  concurrency?: number

  /**
   *  Maximum number of that job that can be locked at once.
   */
  lockLimit?: number

  /**
   * Interval in ms of how long the job stays locked for (see multiple job processors for more info).
   * A job will automatically unlock once a returned promise resolves/rejects.
   */
  lockLifetime?: number

  /**
   * Specifies the priority of the job. Higher priority jobs will run first.
   */
  priority?: 'lowest' | 'low' | 'normal' | 'high' | 'highest' | number

  /**
   * Flag that specifies whether the result of the job should also be stored in the database. Defaults to false.
   */
  shouldSaveResult?: boolean

  /**
   * The name of the job. Useful for readability when browsing jobs.
   * Defaults to the name given on the JobMap object on init.
   */
  name?: string
}

export interface JobMap {
  [key: string]: Job
}

export interface JobInfo extends AgendaJob {
  /**
   * For an single-type job, the number of retries executed.
   */
  timesExecuted: number
}

export type RunFunction = (data: any, job: JobInfo) => any

export interface ScheduleJobOpts {
  /**
   * If included, will run the job at the specified Date. Can also be a human readable string (e.g. "in 5 minutes"). If not included, will use the JobDefinition.getNextRun(). If getNextRun is null, it will run immediately.
   */
  runAt?: Date | string

  /**
   * If included (and runAt is null), will run the job after that amount of milliseconds.
   */
  waitToRun?: number

  /**
   * In case deduplication is needed.
   */
  uniqueness?: {
    /**
     * The uniqueness key. If included, will tag the job with the given key on the first run. If a job with the same key is scheduled after the first run, an error will be thrown and the job won't be ran.
     */
    key: string

    /**
     * If set to true, instead of throwing an error when a job with the given key is not unique, the job will be omitted silently.
     */
    ignoreError?: boolean
  }
}

export type ScheduleJobFunction = (data?: object, opts?: ScheduleJobOpts) => Promise<AgendaJob>
export interface Job {
  /**
   * Internal use only.
   */
  __initialize: (jobName: string) => JobDefinition

  /**
   * A function that schedules an single-type job or does nothing for recurrent jobs.
   * @param data The data that will be passed to the job's run function. Must be an object. Defaults to an empty object.
   * @param runAt: The date when the job should be executed. Defaults to the result of calling getNextRun(). If getNextRun is not defined, defaults to the current moment. Can be a Date object or a human-readable string (e.g. "in 5 minutes").
   */
  schedule: ScheduleJobFunction
}

export type PromiseProcessor = (job: AgendaJob) => void | Promise<void>
