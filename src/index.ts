import { IRouter } from 'express'
import { Path, Plugin, ServerAPI } from '@signalk/server-api'

module.exports = (app: ServerAPI): Plugin => {
  const plugin: Plugin = {
    id: 'signalk-boatinstrument-plugin',
    name: 'Companion SignalK Plugin for the Boat Instrument',

    start: (settings, restartPlugin) => {
      app.debug(`Start settings="${settings}"`)

      plugin.registerWithRouter = (router: IRouter) => {
        router.post('/putPath', (req: any, res: any) => {
          app.debug(`putPath path="${req.body['path']}" value="${req.body['value']}"`)

          app.handleMessage(plugin.id, {
            updates: [{
              values: [{
                path: 'boatinstrument.'+req.body['path'] as Path,
                value: req.body['value']
              }]
            }]
          })

          res.json({
            statusCode: 200,
            state: 'COMPLETED'
          })
        })
      }
    },
    stop: () => {
      app.debug(`Stop`)
    },
    
    schema: {
      properties: {
      }
    }
  }

  return plugin
}

