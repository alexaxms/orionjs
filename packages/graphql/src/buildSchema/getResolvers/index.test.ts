import {resolver} from '@orion-js/resolvers'
import {TypedModel, Prop} from '@orion-js/typed-model'
import getResolvers from './index'

describe('Test get resolvers schema', () => {
  it('Should correctly build a resolvers schema using typed models', async () => {
    @TypedModel()
    class TestParams {
      @Prop()
      userId: string
    }

    @TypedModel()
    class TestModel {
      @Prop()
      name: string

      @Prop()
      age: number
    }

    const globalResolver = resolver<TestParams, TestModel>({
      params: TestParams,
      returns: TestModel,
      async resolve(params) {
        return {
          name: 'test',
          age: 10
        }
      }
    })

    const resolvers = {globalResolver}
    const mutation = false
    const options = {}
    const schema: any = await getResolvers({resolvers, mutation, options})

    expect(schema.globalResolver.type.toString()).toEqual('TestModel')
    expect(schema.globalResolver.args).toHaveProperty('userId')
    expect(await schema.globalResolver.resolve()).toEqual({
      name: 'test',
      age: 10
    })
  })
})