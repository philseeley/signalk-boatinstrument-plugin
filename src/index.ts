import { IRouter } from 'express'
import { Path, Plugin, ServerAPI } from '@signalk/server-api'

module.exports = (app: ServerAPI): Plugin => {
  const plugin: Plugin = {
    id: 'signalk-boatinstrument-plugin',
    name: 'Companion SignalK Plugin for the Boat Instrument',

    start: (settings, restartPlugin) => {
      app.debug(`Start settings="${JSON.stringify(settings)}"`)

      plugin.registerWithRouter = (router: any) => {
        const access = (level: string) =>
          typeof router.access === "function" ? router.access(level) : router;

        access("readwrite").post('/putPath', (req: any, res: any) => {
          var p = 'boatinstrument.'+req.body['path'] as Path;
          var v = req.body['value'];

          app.debug(`putPath path="${p}" value="${JSON.stringify(v)}"`)

          app.handleMessage(plugin.id, {
            updates: [{
              values: [{
                path: p,
                value: v
              }],
              meta: [{
                path: p,
                value: {
                  timeout: 0
                }
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

