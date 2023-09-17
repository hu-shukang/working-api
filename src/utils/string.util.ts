import { v4 } from 'uuid';

class StringUtil {
  public uuid() {
    return v4();
  }
}

export const stringUtil = new StringUtil();
