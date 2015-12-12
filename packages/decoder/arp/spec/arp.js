import fs from 'fs'
import EthernetDecoder from '../../ethernet/lib/ethernet'
import ARPDecoder from '../lib/arp'
import { PayloadSlice } from 'dripper/type'

describe ("ARP", () => {
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

  beforeEach ((done) => {
    (new EthernetDecoder()).analyze(packet).then((packet) => {
      (new ARPDecoder()).analyze(packet).then(() => done())
    })
  })

  it ("decodes an arp frame from an ethernet frame", () => {
    let layer = packet.layers[2]
    expect(layer.namespace).toEqual('::Ethernet::ARP')
    expect(layer.name).toEqual('ARP')
    expect(layer.summary).toEqual('[REQUEST] 00:10:38:23:14:b0-192.168.150.1 -> 00:00:00:00:00:00-192.168.150.31')
    expect(layer.attrs.htype.toString()).toEqual("Ethernet (1)")
    expect(layer.attrs.ptype.toString()).toEqual("IPv4 (2048)")
    expect(layer.attrs.hlen).toEqual(6)
    expect(layer.attrs.plen).toEqual(4)
    expect(layer.attrs.operation.toString()).toEqual("request (1)")
    expect(layer.attrs.sha.toString()).toEqual("00:10:38:23:14:b0")
    expect(layer.attrs.spa.toString()).toEqual("192.168.150.1")
    expect(layer.attrs.tha.toString()).toEqual("00:00:00:00:00:00")
    expect(layer.attrs.tpa.toString()).toEqual("192.168.150.31")
    expect(packet.layers[1].attrs.padding.length).toEqual(18)
  })
})
