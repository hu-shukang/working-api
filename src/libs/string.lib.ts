import { v4 } from 'uuid';

class StringLib {
  public uuid() {
    return v4();
  }
}

export const stringLib = new StringLib();
