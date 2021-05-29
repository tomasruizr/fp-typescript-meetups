import { Components } from "src/server";

export const create = (components: Components) => {
  components.endpointManager.registerEndpoint('get', '/users', (req, res) => {
    res.send({name:'tomas'})
  })
}
