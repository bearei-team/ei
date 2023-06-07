import type { Option } from './option';

const optionMap = new Map<string, unknown>();

<<<<<<< HEAD
export const set = (option: Option) => {
  optionMap.clear();
  Object.entries(option).forEach(([key, value]) => optionMap.set(key, value));
};

export const get = (key: string) => optionMap.get(key);
=======
export namespace option {
  export const set = (option: Option) => {
    optionMap.clear();
    Object.entries(option).forEach(([key, value]) => optionMap.set(key, value));
  };

  export const get = (key: string) => optionMap.get(key);
}
>>>>>>> main
