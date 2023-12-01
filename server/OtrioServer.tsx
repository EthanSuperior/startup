export default class OtrioServer{
  recieve(e: MessageEvent<any>) {
    return `${e.data}`;
  }

}