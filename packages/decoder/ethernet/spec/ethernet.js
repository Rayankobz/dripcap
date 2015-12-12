import fs from 'fs'
import EthernetDecoder from '../lib/ethernet'
import { PayloadSlice } from 'dripper/type'

describe("Ethernet", () => {
  let payload = fs.readFileSync(__dirname + '/data.bin')

  let packet = {
    timestamp: new Date(),
    interface: 'eth0',
    options: {},
    payload: payload,
    layers: [{
      namespace: '::<Ethernet>',
      name: 'Raw Frame',
      payload: new PayloadSlice(0, payload.length),
      summary: ''
    }]
  }

  beforeEach((done) => {
    let decoder = new EthernetDecoder()
    decoder.analyze(packet).then(() => done())
  })

  it("decodes an ethernet frame from a raw frame", () => {
    let layer = packet.layers[1]
    expect(layer.namespace).toEqual('::Ethernet::<ARP>')
    expect(layer.name).toEqual('Ethernet')
    expect(layer.summary).toEqual('[ARP] 00:10:38:23:14:b0 -> 74:27:ea:0f:18:95')
    expect(layer.attrs.dst.toString()).toEqual('74:27:ea:0f:18:95')
    expect(layer.attrs.src.toString()).toEqual('00:10:38:23:14:b0')
    expect(layer.attrs.etherType.toString()).toEqual('ARP (2054)')
  })
})
